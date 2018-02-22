// @flow
import SaveQuestion from 'graphql/question-save'

type Epics = {|
    saveQuestionEpic: *
|}

function graphQl(query: GraphQLAST, variables: {} | null = null): Promise<*> {
    const body: Body = { query }

    // Attach variables if set
    if (variables) {
        body.variables = variables
    }

    return fetch('http://local.test.thing', {
        method: 'POST',
        body: JSON.stringify(body)
    })
}

const SAVING: string = 'test'

const saveQuestionEpic: * = (action$: any): * =>
    action$.ofType(SAVING).mergeMap(({ payload }: ReduxActionWithPayload<?DocSavePayload>): Promise<ReduxActionWithPayload<SavedPayload> | ReduxActionWithPayload<Error>> =>
        graphQl(SaveQuestion, payload)
            .then(({ data: { updateCheckin } }: SaveResponse): ReduxActionWithPayload<SavedPayload> =>
                console.log('THING', updateCheckin)
            )
            .catch((error: Error): ReduxActionWithPayload<Error> => console.log('THING', error))
    )

export const epics: Epics = {
    saveQuestionEpic
}
