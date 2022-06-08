import express from 'express'
import {MetaPreview, Stream} from "stremio-addon-sdk";
import {mako} from "./streams/mako";

const meta = Array() as Array<MetaPreview>

function addchannel(name:string,img:string){

meta.push({id: `isratv-${name}`, background: img, logo: img, name: name, posterShape:'square', poster:img, type:'tv'})

}


addchannel('CH13','https://media.reshet.tv/image/upload/v1505910155/logo-final-13-reshet-red_a5lwvy.jpg')
addchannel('CH12','https://i.ibb.co/qBKNrv5/keshet.png')
addchannel('CH14','https://www.now14.co.il/wp-content/themes/14-child/assets/logo14/Desktop_Logo1.png')
addchannel('כנסת','https://i.ibb.co/zP5vjLD/knesset.png')
addchannel("CH11","https://www.kan.org.il/images/logo_ogImageKan.jpg")


const app = express()



 const manifest ={
	id: 'com.rgdev.isratv',
	version: '1.0.0',
	description: "watch israel tv",
	logo: 'https://play-lh.googleusercontent.com/Pl_OLG0gYA4J2Q_qko78yg2ZB4B3ohH4YEMl-vY9KC-PnZMPGSjUO84O2uA0D3o5kVo=w240-h480-rw',

	name: 'isratv for streamio',

	catalogs: [{type: 'tv', id:'main', name:'isratv'}],

	resources: ['catalog','stream','meta'],
	types: ['tv'],
	idPrefixes: ['isratv-']

 }




app.use((req, res, next) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Content-Type', 'application/json');
	next()

}
)



app.get('/manifest.json', function (req, res) {
res.send(JSON.stringify(manifest))
}
);











app.get('/catalog/:type/:id.json', function (req, res, next) {


	const id = req.params.id


	return res.send(JSON.stringify({metas: meta}))


 }
 );









app.get('/stream/:type/:id.json', async (req, res) => {


	const fullUrl = req.protocol + '://' + req.header('host')



	const type = req.params.type
	const id = req.params.id


	let stream = Array() as Array<Stream>


	switch (id.toLowerCase()){
		case 'isratv-ch13':
			stream = [{ url: 'https://d18b0e6mopany4.cloudfront.net/out/v1/08bc71cf0a0f4712b6b03c732b0e6d25/index_3.m3u8' }]
			break

		case 'isratv-ch14':

			stream = [{ url: 'https://dvr.ch20-cdnwiz.com/hls/live_720/index.m3u8' }]
			break

		case 'isratv-כנסת':
			stream = [{ url: 'https://contact.gostreaming.tv/Knesset/myStream/playlist.m3u8' }]
			break

		case 'isratv-ch11':
			stream = [{ url: 'https://kan11.media.kan.org.il/hls/live/2024514/2024514/source1_1.8k/chunklist.m3u8' }]
			break


		case 'isratv-ch12':



			//@ts-ignore
			/*stream = [{ url: link, behaviorHints: {notWebReady : true , proxyHeaders: { "request": { "User-Agent": mako.ua() }}}   } ]*/

			stream = [{ url: `${fullUrl}/mako`  } ]

			break


	 	case 'isratv-testtttt':
			stream = [{ url: 'https://sixty-cars-peel-147-235-216-204.loca.lt' } ]
			break

	 }


	return res.send(JSON.stringify({streams: stream}))


}
);








app.get('/mako', async (req, res) => {

	let ua = req.header('user-agent')
	if (!ua){
	ua = 'isratv'
	}

	try {
		const link = await mako.addmakoticket('https://mako-streaming.akamaized.net/stream/hls/live/2033791/k12dvr/index.m3u8?b-in-range=800-2400&', ua)

		return res.redirect(link)

	}catch (e){
		return res.status(400).send(e.toString())
	}

}
)






app.get('/meta/:type/:id.json', function (req, res) {


	const type = req.params.type
	const id = req.params.id

	const channel = meta.find(x=>x.id == id)

	if (channel){
	return res.send(JSON.stringify({meta:channel}))
	}

	return res.status(400).send('')

}
);





app.listen(5000, () => {
console.log(`http://localhost:5000/manifest.json`);
}
);