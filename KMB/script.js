const body = document.getElementById("body")

const KMBRouteURL = "https://data.etabus.gov.hk/v1/transport/kmb/route/";



const getKMBRoutes = async () => {
    try {
        const res = await fetch(KMBRouteURL, {
            method: "GET"
        });
        const KMBRoutes = await res.json();
    } catch (err) {
        console.log(err)
        return false;
    }
}

const displayKMBRoutes = (arr) => {
    arr.forEach(routeObj => {
        const { route, bound, service_type, orig_tc, dest_tc, orig_en, dest_en} = routeObj;
        routeElement = document.createElement("div");
        routeElement.textContent = `Route: ${route}, Origin: ${orig_en}, Destination: ${dest_en}`
        body.append(routeElement);
    })
}

const DisplayStopListFromRoute = async (routeNum, routeDirection, routeService_type) => {
    try{
        const routeAndStopsURL = `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${routeNum}/${routeDirection}/${routeService_type}`
        const res = await fetch(routeAndStopsURL, {method: "GET"})
        const stopList = await res.json()
        console.log(stopList.data)
        stopList.data.forEach(stopObj => {
            const { route, bound, stop, seq } = stopObj;
            
            const routeStop = document.createElement("div");
            console.log("LM");
            getStopInfoFromHash(stop)
                .then(data => {
                    routeStop.textContent = `Stop: ${seq}, Stop name: ${data.name_en}`
                    body.append(routeStop);
                });
        })
    } catch (err) {
        `Error when fetching stop list from route url: ${err}`
    }
}

const getStopInfoFromHash = async (hash) => {
    try {
        const stopURL = `https://data.etabus.gov.hk/v1/transport/kmb/stop/${hash}`
        const res = await fetch(stopURL, {method: "GET"})
        const stopInfo = await res.json();
        console.log(stopInfo.data);
        const { name_tc, name_en, lat, long } = stopInfo.data;
        return {name_tc, name_en, lat, long}
    } catch(err) {
        console.log(`Error when fetching stop info from hash: ${err}`)
    }
}



DisplayStopListFromRoute("1", "inbound", "1")