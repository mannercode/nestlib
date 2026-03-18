export const MongooseErrors = {
    DocumentNotFound: (notFoundId: string) => ({
        code: 'ERR_MONGOOSE_DOCUMENT_NOT_FOUND',
        message: 'Document not found',
        notFoundId
    }),
    FiltersRequired: () => ({
        code: 'ERR_MONGOOSE_FILTERS_REQUIRED',
        message: 'At least one filter condition must be provided'
    }),
    MaxLimitExceeded: (maxLimit: number, limit: number) => ({
        code: 'ERR_MONGOOSE_MAX_LIMIT_EXCEEDED',
        message: "The 'limit' parameter exceeds the maximum allowed value",
        limit,
        maxLimit
    }),
    MultipleDocumentsNotFound: (notFoundIds: string[]) => ({
        code: 'ERR_MONGOOSE_MULTIPLE_DOCUMENTS_NOT_FOUND',
        message: 'One or more documents not found',
        notFoundIds
    }),
    LimitInvalid: (limit: number) => ({
        code: 'ERR_MONGOOSE_LIMIT_INVALID',
        message: 'limit must be a positive number',
        limit
    })
}
