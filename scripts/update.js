import { ensureDirSync, outputJson } from 'fs-extra'
import fetch from 'node-fetch'

import { resolvePath } from './utils'

const dataUrl = 'https://kcwikizh.github.io/kcdata/quest/poi.json'

async function main() {
  ensureDirSync(resolvePath('./data'))

  console.log('fetch poi.json...')

  const data = await fetch(dataUrl).then(resp => resp.json())
  outputJson(resolvePath('./data/poi.json'), data)

  console.log('parsing relation...')

  const edges = data.flatMap(quest =>
    quest.prerequisite.map(prereq => ({
      source: prereq,
      target: quest.game_id,
    })),
  )
  outputJson(resolvePath('./data/edges.json'), edges)
  console.log('success~')
}

main()
