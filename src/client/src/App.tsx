import React, { useEffect, useState } from "react";
import "./App.css";
import callApi from "./functions/callApi";

type RequestShape = {
    id: number,
    url: string,
    status: "NEW" | "PROCESSING" | "DONE" | "ERROR",
    httpCode: number,
}

type ApiResponse = {
    message?: string,
    status: number;
    length: number;
} & RequestShape[];

const fetchRequests = async (): Promise<RequestShape[] | undefined> => {
    try {
        const response: ApiResponse | undefined = await callApi<ApiResponse>("requests", "GET")
        if(response !== undefined) return response.filter((item: RequestShape) => typeof item === "object");
        else return undefined;
    }catch (e) {
        console.error(e);
    }
}

const switchProcessing = async (isOnProcessing: boolean): Promise<number | undefined> => {
    try {
        const result = await callApi<ApiResponse | undefined>(
            "switch-cron",
            "POST",
            JSON.stringify({
                flag: !isOnProcessing
        }));
        return result?.status;
    }catch (e) {
        console.error(e);
    }
}

function App() {
    const [requests, setRequests]
        = useState<RequestShape[]>([]);
    const [isOnProcessing, setIsOnProcessing]
        = useState<boolean>(JSON.parse(localStorage.getItem("isOnProcessing") || "false"));

    useEffect(() => {
        const getData = async (): Promise<void> => {
            const data: RequestShape[] | undefined = await fetchRequests();
            if(data?.length) setRequests(data);
        };
        getData();
        if(isOnProcessing){
            const interval = setInterval(() =>{
                getData();
            }, 10000)
            return () => clearInterval(interval);
        }
    }, [isOnProcessing]);

  return (
    <div className="App">
        {
            requests !== undefined && requests.length > 0 ? (
                <>
                    <div className="table-grid">
                        <div className="header">id</div>
                        <div className="header">url</div>
                        <div className="header">status</div>
                        <div className="header">http_code</div>
                        {requests.map((request: RequestShape) => (
                            <React.Fragment key={request.url}>
                                <div className="row">{request.id}</div>
                                <a href={request.url} target="_blank" className="row" rel="noreferrer">{request.url}</a>
                                <div className="row">{request.status}</div>
                                <div className="row">{request.httpCode}</div>
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        className="processing-button"
                        style={{backgroundColor: !isOnProcessing ? "#5ca45c" : "red"}}
                        onClick={async () => {
                            const code = await switchProcessing(isOnProcessing);
                            if (code === 200) {
                                localStorage.setItem("isOnProcessing", JSON.stringify(!isOnProcessing));
                                setIsOnProcessing(prevState => !prevState);
                            }
                        }}
                    >
                        {!isOnProcessing ? "Start Processing" : "Stop Processing"}
                    </button>
                </>
            ) : (
                <div className="no-data">No data</div>
            )
        }
    </div>
  );
}

export default App;
