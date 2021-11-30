import geckos, { ClientChannel } from '@geckos.io/client'
import Player from "../world/components/Player";
import { PlayerAction } from "../world/system/enums/Enumerations";

export default class Connection {

    private readonly channel : ClientChannel

    constructor(port : number = 4000) {
        this.channel = geckos({ port })
    }

    connect(callback : Function) {

        this.channel.onConnect(error => {

            if (error) {
              console.error(error.message)
              callback(false)
              return
            }

            this.listenToServerEvents()

            callback(true)
          })
    }

    handlePlayerActions(player : Player) {

        player.addEventListener(PlayerAction.MOVE, event => {
            //console.log('Player position is ' + JSON.stringify(event.message))
            // this.channel.emit('chat message', 'a short message sent to the server')
        })

        player.addEventListener(PlayerAction.ROTATE, event => {
            //console.log('Player rotation is ' +  JSON.stringify(event.message))
        })

        player.addEventListener(PlayerAction.ATTACK, _ => {
            //console.log('Player attacked')
        })
    }

    private listenToServerEvents() {
        this.channel.on('chat message', data => {
            console.log(`You got the message ${data}`)
        })
    }
}