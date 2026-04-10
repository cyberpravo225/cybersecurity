import { randomPools } from '../data/gameData'

export const randomizeContext = () => ({
  sender: randomPools.sender[Math.floor(Math.random() * randomPools.sender.length)],
  delivery: randomPools.delivery[Math.floor(Math.random() * randomPools.delivery.length)],
  place: randomPools.place[Math.floor(Math.random() * randomPools.place.length)],
})

export const hydrateText = (text, ctx) => text
  .replace('{sender}', ctx.sender)
  .replace('{delivery}', ctx.delivery)
  .replace('{place}', ctx.place)
