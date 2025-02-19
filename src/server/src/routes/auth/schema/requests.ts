const getRequests = {
    description: 'Get all requests',
    response: {
        200: {
            description: 'All requests',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number'
                    },
                    url: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        enum: ['NEW', 'PROCESSING', 'DONE', 'ERROR']
                    },
                    httpCode: {
                        anyOf: [
                            { type: 'number' },
                            { type: 'null' }
                        ]
                    }
                }
            }
        },
        404: {
            description: 'Not Found',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                }
            }
        },
        500: {
            description: 'Server Error',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                }
            }
        }
    }
}

const switchCron = {
    description: 'Start Cron',
    body: {
        type: 'object',
        properties: {
            flag: {
                description: 'Flag on/off',
                type: 'boolean'
            }
        },
    },
    response: {
        200: {
            description: 'Successful switch',
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                }
            }
        }
    },
    500: {
        description: 'Server Error',
        type: 'object',
        properties: {
            message: {
                type: 'string',
            }
        }
    }
}

export {
    getRequests,
    switchCron
}