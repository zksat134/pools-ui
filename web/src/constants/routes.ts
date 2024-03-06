import { DappLayout } from "../components"
import IndexPage from "../pages/IndexPage"
import DepositPage from "../pages/Deposit"
import ExplorerPage from "../pages/Explorer"
import WithdrawPage from "../pages/Withdraw"

export const routes = [
    { path: '/', component: IndexPage, layout: undefined },
    { path: '/deposit', component: DepositPage, layout: DappLayout},
    { path: '/withdraw', component: WithdrawPage, layout: DappLayout },
    { path: '/explorer', component: ExplorerPage, layout: DappLayout }
]