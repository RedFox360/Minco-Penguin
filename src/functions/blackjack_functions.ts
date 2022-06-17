import { ColorResolvable, MessageEmbed } from 'discord.js';

export function isBlackjack(cards: any[]) {
  if (cards.length !== 2) return;
  const sorted = cards.sort((a, b) => a.value - b.value);
  return sorted[0].value === 0 && sorted[1].value === 10;
}

export type Outcome =
  | 'You won!'
  | 'You lost'
  | 'You drew'
  | 'You busted (loss)'
  | 'Minco Penguin busted (win)'
  | 'You got a blackjack! (win)'
  | 'Minco Penguin got a blackjack (loss)';
const losingOutcomes: Outcome[] = [
  'You lost',
  'You busted (loss)',
  'Minco Penguin got a blackjack (loss)'
];
const winningOutcomes: Outcome[] = [
  'You won!',
  'Minco Penguin busted (win)'
];

interface Winnings {
  amount: number;
  outcomeInts: (0 | 1 | 2 | 3)[];
}

export function calculateOutcomeData(
  outcomes: Outcome[],
  bets: number[]
): Winnings {
  if (outcomes?.length === 1) {
    if (winningOutcomes.includes(outcomes[0]))
      return {
        amount: bets[0],
        outcomeInts: [0]
      };
    if (losingOutcomes.includes(outcomes[0]))
      return {
        amount: -bets[0],
        outcomeInts: [1]
      };
    if (outcomes[0] === 'You drew')
      return {
        amount: 0,
        outcomeInts: [2]
      };
    if (outcomes[0] === 'You got a blackjack! (win)')
      return {
        amount: Math.round(bets[0] * 1.5),
        outcomeInts: [3]
      };
  } else {
    // multiple hands
    let winnings = 0;
    const outcomeInts = new Array<0 | 1 | 2 | 3>();
    outcomes.forEach((outcome, index) => {
      if (winningOutcomes.includes(outcome)) {
        winnings += bets[index];
        outcomeInts.push(0);
      } else if (losingOutcomes.includes(outcome)) {
        winnings -= bets[index];
        outcomeInts.push(1);
      } else if (outcome === 'You drew') {
        outcomeInts.push(2);
      } else if (outcome === 'You got a blackjack! (win)') {
        winnings += Math.round(bets[index] * 1.5);
        outcomeInts.push(3);
      }
    });
    return {
      amount: winnings,
      outcomeInts
    };
  }
}

export function getEmbed(
  bets: number[],
  playerHands: Card[][],
  dealer: Card[],
  playerValues: Value[],
  hideDealer: boolean,
  currentHand?: number,
  dealerValue?: Value,
  outcome?: Outcome[],
  winningData?: Winnings
) {
  if (!hideDealer && !dealerValue) {
    throw new Error(
      'Dealer value was not provided when showing dealer.'
    );
  }
  let color: ColorResolvable = '#5DADE2';
  let betOutcome: string;
  if (winningData) {
    const { outcomeInts, amount } = winningData;
    if (amount > 0) {
      color = '#76d7c4';
      betOutcome = `You won ${amount} MD!`;
    } else if (amount < 0) {
      color = '#f1948a';
      betOutcome = `You lost ${Math.abs(amount)} MD!`;
    } else if (amount === 0) {
      color = '#f7dc6f';
      betOutcome = `You didn't win anything!`;
    } else if (outcomeInts.includes(3)) {
      color = '#f7dc6f';
      betOutcome = `You won ${amount} MD!`;
    }
  }

  const hasMultipleHands = playerValues.length > 1;
  const formattedOutcome =
    outcome &&
    (outcome?.length === 1
      ? `*${outcome[0]}*`
      : outcome.map((e, i) => `Hand ${i + 1}: *${e}*`).join('\n'));
  let description: string;
  if (bets.length > 1)
    description = `Bet: **${bets.join(' + ')}** (${bets.reduce(
      (a, c) => a + c
    )}) MD`;
  else description = `Bet: **${bets[0].toLocaleString()}**`;

  if (outcome)
    description += '\n' + formattedOutcome + '\n' + betOutcome;
  else if (hasMultipleHands)
    description += `\nCurrently playing on hand ${currentHand + 1}`;

  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(outcome ? 'Blackjack: Game Over' : 'Blackjack')
    .setDescription(description)
    .addFields(
      hasMultipleHands
        ? playerHands.map((hand, index) => ({
            name: `Your Hand #${index + 1}`,
            value: `${displayCards(hand)}
		
Value: ${playerValues[index].display}`
          }))
        : [
            {
              name: 'You',
              value: `${displayCards(playerHands[0])}
							
Value: ${playerValues[0].display}`
            }
          ]
    )
    .addField(
      'Minco Penguin',
      hideDealer
        ? `${dealer[0].type}${dealer[0].display} |`
        : `${displayCards(dealer)}

Value: ${dealerValue.display}`
    );

  return embed;
}
export function displayCards(cards: Card[]) {
  return cards.map(card => `${card.type}${card.display}`).join('   ');
}

export const types = [
  ':clubs:',
  ':hearts:',
  ':diamonds:',
  ':spades:'
];
export const cards = [
  { display: 'A', value: 0 },
  { display: '2', value: 2 },
  { display: '3', value: 3 },
  { display: '4', value: 4 },
  { display: '5', value: 5 },
  { display: '6', value: 6 },
  { display: '7', value: 7 },
  { display: '8', value: 8 },
  { display: '9', value: 9 },
  { display: '10', value: 10 },
  { display: 'J', value: 10 },
  { display: 'K', value: 10 },
  { display: 'Q', value: 10 }
];
export function createDeck(): Card[] {
  const deck = [];
  for (const type of types) {
    for (const card of cards) {
      deck.push({ type, ...card });
    }
  }
  return deck;
}
export function getValue(cards: Card[], beginning = false): Value {
  if (beginning && isBlackjack(cards)) {
    return {
      display: '**Blackjack**',
      value: 21
    };
  }
  const nums = cards.map(card => card.value);
  let isSoft = false;
  let value = 0;
  let aces = 0;
  for (const num of nums) {
    if (num === 0) {
      aces++;
    } else {
      value += num;
    }
  }
  if (aces) {
    for (let i = 0; i < aces; i++) {
      if (value + 11 > 21) {
        value += 1;
      } else {
        value += 11;
        isSoft = true;
      }
    }
  }
  return {
    display: isSoft ? `Soft **${value}**` : `**${value}**`,
    value
  };
}

export interface Card {
  type: ':clubs:' | ':hearts:' | ':diamonds:' | ':spades';
  display:
    | 'A'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'J'
    | 'K'
    | 'Q';
  value: 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export function removeRandom<T>(array: T[]): T {
  return array.splice(Math.floor(Math.random() * array.length), 1)[0];
}

interface Value {
  display: string;
  value: number;
}
