<script lang="ts">
    import * as zip from "@zip.js/zip.js";
    
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

    const dataFiles: LeagueOfLegendsFiles = {
        chat: [],
        clash: undefined,
        reports: undefined,
        rp: undefined,
        summoner: undefined,
        store: undefined,
    }
    const data: LeagueOfLegendsData = {
        reports: {reports_made: [], reports_received: []},
        rp: [],
        summoner: {summoner_name: "Not Found", lol_platform: "EUW1"},
        store: [],
    }


    let summonerData: LoLSummoner;
    const storeData: StoreData = {
        firstDate: "Unknown",
        ip: 0,
        rp: 0,
        gifts_given: 0,
        gifts_received: 0,
        total_refunds: 0,
        rp_sent: 0,
        rp_received: 0,
        money_spent: 0,
    }
    
    function readZipFile(event: any) {
        const files = event.target.files;
        if (files[0])
            new zip.ZipReader(new zip.BlobReader(files[0])).getEntries().then( (zipFiles: zip.Entry[]) => other(zipFiles) )
    }

    function other(bacalhau: zip.Entry[]) {
        const leagueFiles: zip.Entry[] = [];
        bacalhau.map( (f) => {
            if(f.filename.includes("leagueoflegends"))
                leagueFiles.push(f);
        } );
        
        for (const f of leagueFiles) {
            const name = f.filename;
            if (name.includes("chat_logs_v2"))
                continue;

            if (name.includes("grouped_reports")) {
                f.getData?.(new zip.TextWriter()).then( (text) => data.reports = JSON.parse(text) );
                continue;
            }

            if (name.includes("rp_purchase_history")) {
                f.getData?.(new zip.TextWriter()).then( (text) => { data.rp = JSON.parse(text); calculateMoneySpent() } );
                continue;
            }

            if (name.includes("summoner")) {
                f.getData?.(new zip.TextWriter()).then( (text) => data.summoner = JSON.parse(text) );
                continue;
            }

            if (name.includes("store_transactions")) {
                f.getData?.(new zip.TextWriter()).then( (text) => { data.store = JSON.parse(text); cleanStoreData(data.store); } );
                continue;
            }
        }
    }

    function calculateMoneySpent() {
        if (!data.rp)
            return;

        for (const register of data.rp) {
            storeData.money_spent += Number(register.amount);
        }
    }

    function cleanStoreData(tempData: Array<LoLStore>) {
        storeData.firstDate = "Unknown";
        storeData.ip = 0;
        storeData.rp = 0;
        storeData.gifts_given = 0;
        storeData.gifts_received = 0;
        storeData.firstDate = tempData[0].created;
        
        for (const register of tempData) {
            if (storeData.firstDate > register.created) // updates oldest date
                storeData.firstDate = register.created

            switch(register.type) {
                case "ITEM_TRANSFER_RECEIVED":
                    storeData.gifts_received += 1;
                    break;
                case "PURCHASE":
                    storeData.ip += -register.ip_delta;
                    break;
                case "PURCHASED_GIFT":
                case "PURCHASED_MYSTERY_GIFT":
                    storeData.gifts_given += 1;
                    break;
                case "REFUND":
                    storeData.total_refunds += 1;
                    break;
                case "RP_TRANSFER_RECEIVED":
                case "USER_PURCHASED_RP":
                    storeData.rp += register.rp_delta;
                    break;
                case "RP_TRANSFER_SENT":
                    storeData.rp_sent += -register.rp_delta;
                    break;
                default: continue;
            }
        }

        storeData.firstDate = storeData.firstDate.split(" ")[0];
    }
</script>




<main>
    <div class="w-2/5 mx-auto pb-10">
        <div class="my-10">
            Select data.zip: 
            <input type="file" accept=".zip" on:change="{readZipFile}">
        </div>
        <h2 class="text-2xl font-bold">
            League of Legends
        </h2>
        <hr class="mb-5 rounded border-blue-800 border-2">
        <div class="space-y-10">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-xs">Summoner name</p>
                    <span class="font-bold text-lg">{data.summoner.summoner_name}</span>
                </div>
                <div class="font-bold text-lg">
                    {data.summoner.lol_platform}
                </div>
            </div>
            <div>
                <h3 class="text-xl font-bold">
                    Store information
                </h3>
                <p class="mt-4">
                    Since <span class="font-bold text-sm">{storeData.firstDate}</span> you:<br>
                </p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="store-card">
                        Spent <span class="font-bold text-lg">{storeData.ip}</span> ip/be
                    </div>
                    <div class="store-card">
                        Spent <span class="font-bold text-lg">{storeData.money_spent}</span> €/$<br>
                    </div>
                    <div class="store-card">
                        Bought <span class="font-bold text-lg">{storeData.rp}</span> rp<br>
                    </div>
                    <div class="store-card col-span">
                        Made <span class="font-bold text-lg">{storeData.total_refunds}</span> refunds<br>
                    </div>
                    <div class="store-card">
                        Gived <span class="font-bold text-lg">{storeData.gifts_given}</span> gifts<br>
                    </div>
                    <div class="store-card">
                        Received <span class="font-bold text-lg">{storeData.gifts_received}</span> gifts<br>
                    </div>
                    
                </div>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-2">
                    Reports information
                </h3>
                <p class="mt-4">
                    Your reports:<br>
                </p>
                <div class="grid grid-cols-2 gap-4">
                    {#each Object.entries(data.reports.reports_made) as [reportName, totalReports]}
                        <div class="store-card">
                            {  reportName[0] + reportName.slice(1).replaceAll("_", " ").toLowerCase() } - {totalReports}
                        </div>    
                    {/each}
                </div>
                <p class="mt-4">
                    Reports received:
                </p>
                <div class="grid grid-cols-2 gap-4">
                    {#each Object.entries(data.reports.reports_received) as [reportName, totalReports]}
                        <div class="store-card">
                            { reportName[0] + reportName.slice(1).replaceAll("_", " ").toLowerCase() } - {totalReports}
                        </div>    
                    {/each}
                    
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .store-card {
        @apply bg-blue-800 text-white rounded py-3 text-center align-middle;
    }
</style>