import { useState, useEffect, useCallback } from 'react'
import './App.css'

const ANSWER = 'STING'
const MAX_GUESSES = 6
const WORD_LENGTH = 5

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

// A small valid word list so guesses feel real (includes STING)
const VALID_WORDS = new Set([
  'ABOUT','ABUSE','ACTOR','ACUTE','ADMIT','ADOPT','ADULT','AFTER','AGAIN','AGENT',
  'AGREE','AHEAD','ALARM','ALBUM','ALERT','ALIKE','ALIGN','ALIVE','ALLEY','ALLOW',
  'ALONE','ALONG','ALTER','ANGEL','ANGER','ANGLE','ANGRY','ANIME','ANNEX','ANTIC',
  'APART','APPLE','APPLY','ARISE','ARMOR','ARRAY','ASIDE','ASSET','ATLAS','ATTIC',
  'AUDIO','AUDIT','AVOID','AWAKE','AWARD','AWARE','AWFUL','BASIC','BASIS','BATCH',
  'BEACH','BEARD','BEGIN','BENCH','BERRY','BIRTH','BISON','BLIND','BLOCK',
  'BLOOD','BLOOM','BLOWN','BOARD','BONUS','BOOST','BOUND','BRAIN','BRAND','BRAVE',
  'BREAD','BREAK','BREED','BRICK','BRIDE','BRIEF','BRING','BROAD','BROOK','BROWN',
  'BRUSH','BUILD','BUILT','BURST','BUYER','CABIN','CABLE','CAMEL','CANDY','CARRY',
  'CATCH','CAUSE','CHAIN','CHAIR','CHAOS','CHART','CHASE','CHEAP','CHECK','CHEEK',
  'CHEST','CHIEF','CHILD','CHINA','CHOIR','CHORD','CIVIL','CLAIM','CLASH','CLASS',
  'CLEAN','CLEAR','CLIMB','CLING','CLOCK','CLONE','CLOSE','CLOTH','CLOUD','COACH',
  'COAST','COLOR','COMIC','COMMA','CORAL','COUNT','COURT','COVER','CRACK',
  'CRAFT','CRANE','CRASH','CRAZY','CREAM','CREEK','CRIME','CRISP','CROSS','CROWD',
  'CROWN','CRUEL','CRUSH','CURVE','CYCLE','DAILY','DANCE','DECAY','DELAY','DELTA',
  'DENSE','DEPTH','DERBY','DEVIL','DIRTY','DISCO','DODGE','DOUBT','DOUGH','DRAFT',
  'DRAIN','DRAMA','DRANK','DRAWN','DREAM','DRESS','DRIFT','DRILL','DRINK','DRIVE',
  'DRONE','DROVE','DRUNK','DRYER','DYING','EAGER','EARLY','EARTH','EIGHT','ELITE',
  'EMPTY','ENEMY','ENJOY','ENTER','ENTRY','EQUAL','ERROR','EVENT','EVERY','EXACT',
  'EXERT','EXTRA','FAINT','FAITH','FALSE','FANCY','FATAL','FAULT','FEAST','FENCE',
  'FETCH','FEVER','FIBER','FIELD','FIFTH','FIFTY','FIGHT','FINAL','FIRST','FIXED',
  'FLAME','FLANK','FLASH','FLASK','FLEET','FLESH','FLOAT','FLOCK','FLOOR','FLOUR',
  'FLUID','FLUNK','FOCUS','FORCE','FORGE','FORTH','FORUM','FOUND','FRAME','FRANK',
  'FRAUD','FRESH','FRONT','FROST','FROZE','FRUIT','FULLY','FUNKY','FUNNY','FUZZY',
  'GHOST','GIANT','GIVEN','GLAND','GLASS','GLAZE','GLEAM','GLOBE','GLOOM','GLORY',
  'GLOSS','GLOVE','GOING','GRACE','GRADE','GRAIN','GRAND','GRANT','GRAPH','GRASP',
  'GRASS','GRAVE','GREAT','GREEN','GREET','GRIEF','GRIND','GROAN','GROOM','GROSS',
  'GROUP','GROVE','GROWN','GUARD','GUEST','GUIDE','GUILD','GUILT','GUISE','GUSTO',
  'HABIT','HAPPY','HARSH','HASTE','HAVEN','HEART','HEAVY','HENCE','HERBS','HINGE',
  'HONOR','HORSE','HOTEL','HOUSE','HUMAN','HUMOR','HURRY','HYPER','IDEAL','IMAGE',
  'INFER','INNER','INPUT','INTER','INTRO','ISSUE','IVORY','JUDGE','JUICE','JUICY',
  'JUMPY','KARMA','KNEEL','KNIFE','KNOCK','KNOWN','LABEL','LANCE','LARGE','LASER',
  'LATER','LAYER','LEARN','LEAST','LEDGE','LEMON','LEVEL','LIGHT','LIMIT','LINEN',
  'LOCAL','LODGE','LOGIC','LOOSE','LOVER','LOWER','LUCKY','LUNAR','LUNCH','LYRIC',
  'MAGIC','MAJOR','MAKER','MANOR','MAPLE','MARCH','MARSH','MATCH','MAYOR','MEDIA',
  'MERIT','METAL','METRO','MIGHT','MINOR','MINUS','MIRTH','MODAL','MODEL','MONEY',
  'MONTH','MORAL','MOTOR','MOUNT','MOUSE','MOUTH','MOVIE','MUSIC','NAIVE','NAVAL',
  'NEVER','NIGHT','NOISE','NORTH','NOTED','NOVEL','NURSE','NYMPH','OCCUR','OCEAN',
  'OLIVE','ONSET','OPERA','ORBIT','ORDER','OTHER','OUGHT','OUTER','OXIDE','OZONE',
  'PAINT','PANEL','PANIC','PARTY','PEACE','PEACH','PEARL','PENNY','PERKY','PHASE',
  'PHONE','PHOTO','PIANO','PITCH','PIXEL','PLACE','PLAIN','PLANE','PLANT','PLAZA',
  'PLEAD','PLUCK','PLUMB','PLUME','PLUMP','PLUNK','PLUSH','POINT','POLAR','PORKY',
  'POSED','POWER','PRESS','PRICE','PRIDE','PRIME','PRINT','PRIZE','PROBE','PRONE',
  'PROOF','PROSE','PROVE','PROXY','PSALM','PULSE','PUNCH','PUPIL','PURGE','QUEEN',
  'QUERY','QUEUE','QUICK','QUIET','QUOTA','QUOTE','RADAR','RADIO','RAISE','RALLY',
  'RANGE','RAPID','RATIO','REACH','REALM','REBEL','REFER','REIGN','RELAX','REPAY',
  'REPEL','REPLY','RESET','RIDER','RIDGE','RIGHT','RISKY','RIVAL','RIVER','ROBOT',
  'ROCKY','ROMAN','ROUGE','ROUGH','ROUND','ROUTE','RURAL','SAINT','SALAD','SAUCE',
  'SCALE','SCARE','SCENE','SCOPE','SCORE','SCOUT','SCRAP','SHADE','SHAKE','SHALL',
  'SHAME','SHAPE','SHARE','SHARK','SHARP','SHEAR','SHEEP','SHEER','SHEET','SHELF',
  'SHELL','SHIFT','SHINE','SHIRT','SHOCK','SHORE','SHORT','SHOUT','SHOWN','SIGHT',
  'SIGMA','SKILL','SLATE','SLAVE','SLEEP','SLICE','SLIDE','SLOPE','SLUMP','SMART',
  'SMELL','SMILE','SMITE','SMOKE','SNAKE','SOLAR','SOLID','SOLVE','SORRY','SOUND',
  'SOUTH','SPACE','SPARE','SPARK','SPAWN','SPEAK','SPELL','SPEND','SPILL','SPINE',
  'SPITE','SPLIT','SPOKE','SPOON','SPORT','SPRAY','STACK','STAFF','STAGE','STAKE',
  'STALE','STALL','STAMP','STAND','STARK','START','STATE','STAYS','STEAM','STEEL',
  'STEEP','STEER','STERN','STICK','STIFF','STILL','STING','STOCK','STOMP','STONE',
  'STOOD','STORE','STORM','STORY','STOVE','STRIP','STUCK','STUDY','STUMP','STYLE',
  'SUGAR','SUITE','SUPER','SWAMP','SWEAR','SWEEP','SWEET','SWEPT','SWIFT','SWIPE',
  'SWIRL','TABLE','TAKEN','TASTE','TEETH','TEMPO','TENSE','TENTH','THANK','THEIR',
  'THEME','THERE','THESE','THICK','THING','THINK','THIRD','THOSE','THREE','THREW',
  'THROW','TIGER','TIGHT','TIMER','TIRED','TITLE','TODAY','TOKEN','TOTAL','TOUCH',
  'TOUGH','TOWEL','TOWER','TOXIC','TRACE','TRACK','TRADE','TRAIN','TRAIT','TRASH',
  'TRIAL','TRICK','TRIED','TROOP','TROUT','TROVE','TRUCE','TRUNK','TRUST','TRUTH',
  'TUMOR','TUNED','TWIST','ULTRA','UNIFY','UNION','UNITE','UNTIL','UPPER','USAGE',
  'USING','USUAL','UTTER','VALID','VALUE','VALVE','VAPOR','VAULT','VERGE','VIDEO',
  'VIOLA','VIRAL','VISIT','VISOR','VISTA','VITAL','VIVID','VOCAL','VOICE','VOTER',
  'VAGUE','VALID','VERSE','VIGOR','VINYL','VIRUS','VODKA','WAGON','WATCH','WATER',
  'WEARY','WEAVE','WEDGE','WEIRD','WHALE','WHEAT','WHERE','WHICH','WHILE','WHITE',
  'WHOLE','WIDER','WITCH','WORLD','WORRY','WORSE','WORST','WORTH','WRATH','WRITE',
  'WROTE','YACHT','YIELD','YOUNG','YOUTH','ZONAL',
])

function getTileState(guess, index, answer) {
  const letter = guess[index]
  if (letter === answer[index]) return 'correct'
  if (answer.includes(letter)) return 'present'
  return 'absent'
}

function getKeyStates(guesses) {
  const states = {}
  for (const guess of guesses) {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      const state = getTileState(guess, i, ANSWER)
      // correct > present > absent
      if (states[letter] === 'correct') continue
      if (states[letter] === 'present' && state === 'absent') continue
      states[letter] = state
    }
  }
  return states
}

export default function App() {
  const [guesses, setGuesses] = useState([])       // completed guesses
  const [current, setCurrent] = useState('')        // current input
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [shake, setShake] = useState(false)
  const [message, setMessage] = useState('')

  const showMessage = (msg, duration = 1800) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), duration)
  }

  const submitGuess = useCallback(() => {
    if (current.length !== WORD_LENGTH) {
      showMessage('Not enough letters')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }
    if (!VALID_WORDS.has(current)) {
      showMessage('Not in word list')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }

    const newGuesses = [...guesses, current]
    setGuesses(newGuesses)
    setCurrent('')

    if (current === ANSWER) {
      const msgs = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']
      showMessage(msgs[newGuesses.length - 1] || 'Nice!', 3000)
      setWon(true)
      setGameOver(true)
    } else if (newGuesses.length >= MAX_GUESSES) {
      showMessage(ANSWER, 4000)
      setGameOver(true)
    }
  }, [current, guesses])

  const handleKey = useCallback((key) => {
    if (gameOver) return
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrent(c => c.slice(0, -1))
    } else if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
      setCurrent(c => c + key)
    }
  }, [gameOver, current, submitGuess])

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toUpperCase()
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKey(key === 'BACKSPACE' ? '⌫' : key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  const keyStates = getKeyStates(guesses)

  // Build the full grid rows (completed + current + empty)
  const rows = []
  for (let r = 0; r < MAX_GUESSES; r++) {
    if (r < guesses.length) {
      rows.push({ letters: guesses[r].split(''), state: 'revealed', isShaking: false })
    } else if (r === guesses.length && !gameOver) {
      const letters = current.split('')
      while (letters.length < WORD_LENGTH) letters.push('')
      rows.push({ letters, state: 'active', isShaking: shake })
    } else {
      rows.push({ letters: ['','','','',''], state: 'empty', isShaking: false })
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Stingle</h1>
        <div className="subtitle">The word is always the same — good luck.</div>
      </header>

      {message && <div className="message">{message}</div>}

      <div className="board">
        {rows.map((row, r) => (
          <div key={r} className={`row ${row.isShaking ? 'shake' : ''}`}>
            {row.letters.map((letter, c) => {
              let tileClass = 'tile'
              if (row.state === 'revealed') {
                tileClass += ' ' + getTileState(guesses[r], c, ANSWER)
              } else if (row.state === 'active' && letter) {
                tileClass += ' filled'
              }
              return (
                <div key={c} className={tileClass}>
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, r) => (
          <div key={r} className="keyboard-row">
            {row.map(key => {
              const state = keyStates[key] || ''
              const isWide = key === 'ENTER' || key === '⌫'
              return (
                <button
                  key={key}
                  className={`key ${isWide ? 'wide' : ''} ${state}`}
                  onClick={() => handleKey(key)}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="play-again">
          <button onClick={() => {
            setGuesses([])
            setCurrent('')
            setGameOver(false)
            setWon(false)
            setMessage('')
          }}>
            {won ? 'Play Again' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  )
}
