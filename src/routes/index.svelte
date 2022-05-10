<script lang="ts">
    import * as zip from "@zip.js/zip.js";
    import LoLComponent from "../components/LoL/index.svelte";

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
        <LoLComponent />
    </div>
</main>