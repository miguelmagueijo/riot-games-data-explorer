type LeagueOfLegendsFiles = {
    chat?: zip.Entry[],
    clash?: zip.Entry,
    reports?: zip.Entry,
    rp?: zip.Entry,
    summoner?: zip.Entry,
    store?: zip.Entry,
}

type LeagueOfLegendsData = {
    reports: LoLReports,
    rp: Array<LoLRPPurchase>,
    summoner: LoLSummoner,
    store: Array<LoLStore>,
}



type LoLSummoner = {
    summoner_name: string,
    lol_platform: string,
}

type LoLReports = {
    reports_made: Array<Object>,
    reports_received: Array<Object>,
}

type LoLRPPurchase = {
    amount: string,
    created: string,
    currency_type: string,
    payment_type: string,
    store_account_id: number,
    transaction_id: string,
    transaction_number: string,
    user_ip: string,
}

type LoLStore = {
    created: string,
    id: string,
    ip_address: string,
    ip_balance: number,
    ip_delta: number,
    is_refunded: string,
    item_id: string,
    rp_balance: number,
    rp_delta: number,
    type: string
}

type StoreData = {
    firstDate: string,
    ip: number,
    rp: number,
    gifts_given: number,
    gifts_received: number,
    total_refunds: number,
    rp_sent: number,
    rp_received: number,
    money_spent: number,
}