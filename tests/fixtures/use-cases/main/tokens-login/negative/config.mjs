import MainTokensCreate from '../../../../../../lib/use-cases/main/tokens/Create.mjs'

export default {
    useCaseClass : MainTokensCreate,
    before       : async (factory) => {
        await factory.standardSetup()
        await factory.setupUsers()
    }
}
