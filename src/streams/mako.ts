import axios from "axios";

export class mako{






  public static async 	addmakoticket(url:string,ua:string):Promise<string>{

		const json = await axios.get('https://mass.mako.co.il/ClicksStatistics/entitlementsServicesV2.jsp?et=ngt&lp=/i/24live_1@195271/master.m3u8?b=200-2500&rv=AKAMAI',{headers:{'user-agent':ua}})

			const thejson = json.data as any

		const ticket = thejson.tickets[0].ticket

		if (url.includes('?')){
		url = url + '&'
		} else {
		url = url + '?'
		}


		return url + ticket

	}



}