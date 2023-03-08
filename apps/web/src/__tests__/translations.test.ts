import Path from 'path'
import fs from 'fs'
import teams from 'config/constants/teams'
import { NftLocation } from 'state/nftMarket/types'

// FIXME: should move this test file inside localization pkg
import { translations } from '@verto/localization'

const allTranslationKeys = Object.keys(translations)

// when some keys are hard to be extracted from code
const whitelist = [
  ...Object.values(NftLocation),
  ...teams.map(t => t.description),
  // NFT description moved to profile sdk
  `Oopsie daisy! Hiccup's had a bit of an accident. Poor little fella.`,
  'Eggscellent! Celebrating Syrup Storm winning the Easter Battle!',
  'Melting Easter eggs and melting hearts!',
  'Watch out for Flipsie’s spatula smash!',
  'Do you like chocolate with your res? Go long!',
  'Happy Niu Year! This bunny’s excited for the year of the bull (market!)',
  'Sunny is always cheerful when there is verto around. Smile!',
  `Don't let that dopey smile deceive you... Churro's a master VERTO chef!`,
  `Nommm... Oh hi, I'm just meditating on the meaning of VERTO.`,
  `Three guesses what's put that twinkle in those eyes! (Hint: it's VERTO)`,
  'These bunnies love nothing more than swapping verto. Especially on Rebus Chain.',
  `It's raining res on this bunny, but he doesn't seem to mind. Can you blame him?`,
  `These bunnies like their verto with blueberries. What's your favorite topping?`,
  "Love makes the world go 'round... but so do pancakes. And these bunnies know it.",
  `It’s sparkling res, pancakes, and even lottery tickets! This bunny really loves it.`,
  'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%',
  'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%',
  'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%',
  'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%',
  'Unwrap %amount% %wrap% to %native%',
  'Wrap %amount% %native% to %wrap%',
  'Approve %symbol%',
  'Add %amountA% %symbolA% and %amountB% %symbolB%',
  'Remove %amount% %symbol%',
  'Remove %amountA% %symbolA% and %amountB% %symbolB%',
  'Zap %amountA% %symbolA% and %amountB% %symbolB%',
  'Zap in %amount% REBUS for %symbol%',
  'Zap in %amount% %symbol% for %lpSymbol%',
  'Order cancellation: %inputAmount% %inputTokenSymbol% for %outputAmount% %outputTokenSymbol%',
  'Order cancellation',
]

describe('Check translations integrity', () => {
  it.each(allTranslationKeys)('Translation key value should be equal', key => {
    expect(key).toEqual(translations[key])
  })
})

describe('Check translations available', () => {
  const files = []
  const translationKeys = new Set(allTranslationKeys)

  function throughDirectory(directory, includeJs = false) {
    fs.readdirSync(directory).forEach(file => {
      const absolute = Path.join(directory, file)
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute)
      if (
        (absolute.includes('.tsx') || absolute.includes('.ts') || (includeJs && absolute.includes('.js'))) &&
        !absolute.includes('.d.ts')
      ) {
        return files.push(absolute)
      }
      return files.length
    })
  }

  throughDirectory('src/')
  throughDirectory('../../packages/uikit/src')
  throughDirectory('../../packages/ui-wallets/src')
  throughDirectory('../../packages/uikit/src')
  let match

  const extractedKeys = new Set<string>(whitelist)

  const regexWithoutCarriageReturn = /\bt\((["'`])((?:\\1|(?:(?!\1)).)*)(\1)/gm
  const regexWithCarriageReturn = /\bt\([\r\n]\s+(["'`])([^]*?)(\1)/gm

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithoutCarriageReturn.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithCarriageReturn.exec(data)) !== null
    ) {
      if (match[2].trim()) {
        extractedKeys.add(match[2])
      }
    }

    const regexWithSearchInput = /<SearchInput ([^']*?) \/>/gm
    const regexWithSearchInputPlaceHolder = /placeholder="([^']*?)"/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithSearchInput.exec(data)) !== null
    ) {
      if (match[1].trim()) {
        const placeHolderMatch = regexWithSearchInputPlaceHolder.exec(match[1])
        if (placeHolderMatch[1]) {
          extractedKeys.add(placeHolderMatch[1])
        }
      }
    }

    const regexWithTrans = /<Trans>([^$]*?)<\/Trans>/gm
    const regexWithTransCarriage = /<Trans>([\r\n]\s+([^]*?))<\/Trans>/gm

    while (
      // eslint-disable-next-line no-cond-assign
      (match = regexWithTrans.exec(data)) !== null ||
      // eslint-disable-next-line no-cond-assign
      (match = regexWithTransCarriage.exec(data)) !== null
    ) {
      match = match[1].replace(/\n\s+/g, ' ').trim()
      if (match) {
        extractedKeys.add(match)
      }
    }
  }

  it('Translation key should exist in translations json', () => {
    Array.from(extractedKeys).forEach(key => {
      if (translationKeys.has(key)) {
        extractedKeys.delete(key)
        translationKeys.delete(key)
      }
    })

    try {
      expect(extractedKeys.size).toBe(0)
    } catch (error) {
      throw new Error(
        `Found ${extractedKeys.size} key(s) ${JSON.stringify(
          Array.from(extractedKeys.values()),
          null,
          '\t',
        )} not in translation.json`,
      )
    }
  })

  it('should use all translation key in translation.json', () => {
    try {
      expect(translationKeys.size).toBe(0)
    } catch (error) {
      throw new Error(
        `Found unused ${translationKeys.size} key(s) ${JSON.stringify(
          Array.from(translationKeys.values()),
          null,
          '\t',
        )} in translation.json`,
      )
    }
  })
})
