<script lang="ts">
    const data: LeagueOfLegendsData = {
        reports: {reports_made: [], reports_received: []},
        rp: [],
        summoner: {summoner_name: "Not Found", lol_platform: "EUW1"},
        store: [],
    }

    const storeData2: StoreData = {
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
</script>


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
            Since <span class="font-bold text-sm">{storeData2.firstDate}</span> you:<br>
        </p>
        <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="store-card">
                Spent <span class="font-bold text-lg">{storeData2.ip}</span> ip/be
            </div>
            <div class="store-card">
                Spent <span class="font-bold text-lg">{storeData2.money_spent}</span> €/$<br>
            </div>
            <div class="store-card">
                Bought <span class="font-bold text-lg">{storeData2.rp}</span> rp<br>
            </div>
            <div class="store-card col-span">
                Made <span class="font-bold text-lg">{storeData2.total_refunds}</span> refunds<br>
            </div>
            <div class="store-card">
                Gived <span class="font-bold text-lg">{storeData2.gifts_given}</span> gifts<br>
            </div>
            <div class="store-card">
                Received <span class="font-bold text-lg">{storeData2.gifts_received}</span> gifts<br>
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

<style>
    .store-card {
        @apply bg-blue-800 text-white rounded py-3 text-center align-middle;
    }
</style>