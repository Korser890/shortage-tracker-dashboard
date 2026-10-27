import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

export const metadata: Metadata = {
  title: 'How this works',
  description: 'A guide to reading the Global Resource Shortage Tracker dashboard.',
};

interface CardGuideProps {
  id: string;
  title: string;
  level?: 'h2' | 'h3';
  shows: React.ReactNode;
  read: React.ReactNode;
  why: React.ReactNode;
  not: React.ReactNode;
}

function CardGuide({ id, title, level = 'h2', shows, read, why, not }: CardGuideProps) {
  const Heading = level;
  const rows: [string, React.ReactNode][] = [
    ['What it shows', shows],
    ['How to read it', read],
    ['Why it is here', why],
    ['What it does not tell you', not],
  ];
  return (
    <section id={id} className="scroll-mt-6">
      <Card className="space-y-4">
        <Heading className="text-sm font-semibold text-content">{title}</Heading>
        <dl className="space-y-3">
          {rows.map(([label, body]) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-content">{label}</dt>
              <dd className="space-y-2 text-sm text-muted">{body}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">

        <header className="space-y-3">
          <Link href="/" aria-label="Back to dashboard" className="inline-flex items-center gap-1.5 py-1 text-xs text-muted hover:text-content transition-colors">
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-content">How this works</h1>
          <p className="text-sm text-muted">
            This page explains what every part of the dashboard means. It follows the same order as the dashboard itself, so you can read it from top to bottom while you scroll the site.
          </p>
        </header>

        <section id="what-this-is" className="scroll-mt-6 space-y-2">
          <h2 className="text-sm font-semibold text-content">What this site is for</h2>
          <p className="text-sm text-muted">
            This site watches the price of four energy commodities. It compares today&apos;s price against that commodity&apos;s own recent history. When a price moves far outside its normal range, the site raises a flag. The question it answers is: is anything unusual happening in energy prices right now, and how unusual is it.
          </p>
        </section>

        <CardGuide
          id="top-strip"
          title="The status strip at the top"
          shows={
            <p>
              It names every commodity that is currently flagged, with how far above its 12-month average each one sits. Its colour matches the most serious flag showing right now. The &quot;Latest price&quot; badge in the top right shows the date of the most recent price, plus how old that date is.
            </p>
          }
          read={
            <>
              <p>
                The date in the badge is when the price was published. It is not when the site last ran. The site updates every weekday.
              </p>
              <p>
                The US Energy Information Administration publishes its prices about 6 to 8 business days late. So the newest price available is normally about a week old. A date that looks a week old is normal and does not mean the site is broken.
              </p>
            </>
          }
          why="It gives you the headline before you read anything else. If nothing is flagged, you can stop here."
          not="It does not say whether the price is still rising or has started to fall."
        />

        <CardGuide
          id="commodity-cards"
          title="The four commodity cards"
          shows={
            <>
              <p>
                One card for each of four commodities. Brent Crude Oil and WTI Crude Oil are both crude oil, priced in US dollars per barrel. Henry Hub Natural Gas is American natural gas. EU Natural Gas, also called TTF, is European natural gas. Both gases are priced in US dollars per MMBtu, which is a unit of energy.
              </p>
              <p>
                Brent is the benchmark for oil traded internationally. WTI is the American benchmark. They usually move together but not always. Henry Hub and TTF are the American and European gas benchmarks. They can tell completely different stories, because gas is hard to ship between continents.
              </p>
            </>
          }
          read={
            <>
              <p>
                The percentage on each card compares today&apos;s price with that commodity&apos;s own average over the last 12 months. It does not compare one commodity with another.
              </p>
              <p className="flex flex-wrap items-center gap-2">
                The flag colour shows how serious it is:
                <Pill flag="NORMAL" />
                <Pill flag="RISKY" />
                <Pill flag="CRITICAL" />
              </p>
              <p>
                &quot;X days at current flag&quot; tells you how long the commodity has been at that level.
              </p>
            </>
          }
          why="It lets you compare four different markets at a glance, each against its own normal."
          not={
            <>
              <p>
                A high percentage does not mean the price is high in absolute terms. It means the price is far from its own recent normal. A commodity can be Critical at a price that is cheap by historical standards.
              </p>
              <p>
                One quirk to know about. EU gas is shown in US dollars, not its native euros, so an exchange rate is built into the number. The upside is that it can be compared directly with American gas.
              </p>
            </>
          }
        />

        <CardGuide
          id="signal-history"
          title="Signal history, 90 days"
          shows="One bar per commodity, covering the last 90 days. Each bar is split into coloured segments showing how many days were Normal, Risky and Critical."
          read="The width of each segment is proportional to the number of days. A bar that is mostly green was calm. A bar with a large red segment spent a lot of the last 90 days at Critical."
          why="A flag on its own cannot tell you whether a problem is brand new or has been running for months. This can."
          not="The bar is a summary of the 90 days, not a timeline. It does not show the order the days came in."
        />

        <section id="how-flags-work" className="scroll-mt-6">
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-content">How a flag is decided</h2>
            <p className="text-sm text-muted">
              There are two separate tests. Either one alone is enough to raise a flag.
            </p>
            <p className="text-sm text-muted">
              Test one is the z-score. It measures how far today&apos;s price sits from its 12-month average, in units of how much that price normally bounces around. A score of 1 means one normal step above average. Above 2 means genuinely unusual.
            </p>
            <p className="text-sm text-muted">
              Test two is the plain percentage. It measures how far today&apos;s price sits above its 12-month average.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-edge text-xs text-muted">
                    <th scope="col" className="py-2 pr-4 font-semibold">Flag</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Z-score</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Rule</th>
                    <th scope="col" className="py-2 font-semibold">Price above 12-month average</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  <tr className="border-b border-edge">
                    <td className="py-2 pr-4"><Pill flag="NORMAL" /></td>
                    <td className="py-2 pr-4">Below 1.0</td>
                    <td className="py-2 pr-4">AND</td>
                    <td className="py-2">Within 15%</td>
                  </tr>
                  <tr className="border-b border-edge">
                    <td className="py-2 pr-4"><Pill flag="RISKY" /></td>
                    <td className="py-2 pr-4">1.0–2.0</td>
                    <td className="py-2 pr-4">OR</td>
                    <td className="py-2">15–30% above</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4"><Pill flag="CRITICAL" /></td>
                    <td className="py-2 pr-4">Above 2.0</td>
                    <td className="py-2 pr-4">OR</td>
                    <td className="py-2">30% or more above</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted">
              Why two tests? A calm commodity and a jumpy one need different yardsticks. The z-score adapts to how volatile a commodity normally is. The percentage catches a big move even when the commodity has been jumpy enough to make the z-score look unremarkable.
            </p>
            <p className="text-sm text-muted">
              This is why the dashed threshold lines on the price chart bend. The chart draws whichever of the two limits the price would cross first.
            </p>
          </Card>
        </section>

        <CardGuide
          id="news"
          title="The news feed"
          shows="The ten most recent energy headlines. Each one shows its source, which commodity it was matched to, and a sentiment score of Positive, Negative or Neutral."
          read="The sentiment was scored by software, not by a person. It reads the wording of the headline only. It does not understand context or sarcasm."
          why="Prices tell you something moved. Headlines sometimes tell you why."
          not={
            <>
              <p>
                The feed only covers roughly the last month. It is not a historical archive, so you cannot use it to look up what was being written during an older event on the charts.
              </p>
              <p>
                Also, the commodity label on a headline is only a keyword match. A general market story can end up tagged to one commodity.
              </p>
            </>
          }
        />

        <CardGuide
          id="supply-balance"
          title="Supply balance"
          shows="How much oil the world produces compared with how much it consumes, in millions of barrels per day."
          read="A positive number is a surplus. The world made more than it used. A negative number is a deficit. The world used more than it made. The dot shows where the current figure sits between the lowest and highest readings on record in the data."
          why="Price tells you what the market feels. This tells you whether there is physically enough."
          not="This is monthly, global and slow. It will not explain a price move that happened last week."
        />

        <section id="detail-page" className="scroll-mt-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-content">The commodity page</h2>
            <p className="text-sm text-muted">
              Clicking any commodity card opens a page about just that commodity. It has four parts, explained below.
            </p>
          </div>

          <CardGuide
            id="price-chart"
            level="h3"
            title="The price chart"
            shows="The price over time. The buttons above it switch between 90 days, 1 year, 5 years and all data. Numbered markers show known supply events, which are explained in a list beneath the chart."
            read={
              <>
                <p>
                  The two dashed lines are the Risky and Critical limits. They move over time because they are recalculated from the price&apos;s own recent history. They bend where one of the two tests takes over from the other.
                </p>
                <p>
                  On the 5 year and all-data views, each point is the highest price in that week or month, not the last price. This is so short spikes are not hidden. The chart says which under it.
                </p>
              </>
            }
            why="It shows whether the current flag is a brief jump or part of a longer climb, and how the price compares with every earlier episode."
            not="The flags were worked out from historical data after the fact. They were not predicted in advance."
          />

          <CardGuide
            id="comparison"
            level="h3"
            title="Price comparison"
            shows="Today's price against its 30-day average and its 12-month average, with the percentage difference for each."
            read="Read the two rows separately. The 30-day row is about the last few weeks. The 12-month row is about the last year."
            why="The two often disagree, and the disagreement is the point. A price can be far above its yearly average while already falling back from its monthly one."
            not="It is two snapshots, not a trend."
          />

          <CardGuide
            id="inventory"
            level="h3"
            title="Inventory"
            shows="How much crude oil is held in US storage, shown as a fill level against the highest level seen in the last five years. It also shows whether stocks have been building or draining, and for how many weeks."
            read="A fuller tank means a bigger cushion. A tank that has drained for many weeks in a row means the cushion is shrinking."
            why="Storage is the cushion. A price rise with full storage is different from a price rise with storage draining."
            not="This is US crude oil only. It is not a world figure, and it does not cover gas. It is weekly, so it lags the price."
          />

          <CardGuide
            id="production"
            level="h3"
            title="Production trend"
            shows="Monthly world oil production, with a 12-month average line over it."
            read="If the monthly figures sit above the average line, production is growing. If they sit below, it is shrinking."
            why="It shows whether supply is growing, flat or shrinking underneath whatever the price is doing."
            not="Production data arrives late and moves slowly, so it confirms things rather than warning about them."
          />
        </section>

        <section id="putting-it-together" className="scroll-mt-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-content">Putting it together</h2>
            <p className="text-sm text-muted">
              No single card gives you a conclusion. Read them in this order.
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
              <li>The flag says something is unusual.</li>
              <li>The history says whether it is new or has been running for months.</li>
              <li>The comparison says how far out of line it is.</li>
              <li>The inventory says how much cushion is left.</li>
              <li>Production says whether supply is keeping up.</li>
              <li>The news says whether anyone can name a cause.</li>
            </ol>
          </div>

          <Card className="space-y-3">
            <h3 className="text-sm font-semibold text-content">A worked example: the Strait of Hormuz, 2026</h3>
            <p className="text-sm text-muted">
              On 28 February 2026, strikes on Iran closed the Strait of Hormuz. This is a shipping route that carries roughly 20% of the world&apos;s oil.
            </p>
            <p className="text-sm text-muted">
              There was no clean early warning. Brent had wobbled at Risky in the week before, on 20 to 23 February, then fell back to Normal on 24 February.
            </p>
            <p className="text-sm text-muted">
              Brent went Risky on 28 February at $73.29, then Critical on 2 March at $77.24. WTI followed one day later, Critical on 3 March at $74.48. By 6 March Brent was at $95.74, which was 41.1% above its 12-month average, with a z-score of 6.2.
            </p>
            <p className="text-sm text-muted">
              Brent peaked at $138.21 on 7 April 2026. That is a rise of 78.9% from the price on the day it was first flagged, over 36 days.
            </p>
            <p className="text-sm text-muted">
              US crude storage did not move at all through February and most of March. It began draining in the week of 27 March, losing 378 thousand barrels. The weekly losses grew from there, week by week, to 8,605 thousand barrels by 8 May. They did not grow smoothly, and one week in late April gave back some ground. Over those seven weeks US storage fell by about 31 million barrels in total.
            </p>
            <p className="text-sm text-muted">
              The lesson is plain. The price reacted within two days, and the physical shortage showed up in storage about four weeks later. The price flag was the early signal and the inventory was the confirmation.
            </p>
            <p className="text-xs text-muted">
              The news feed cannot be shown for this example, because it only holds about the last month of headlines.
            </p>
          </Card>
        </section>

        <section id="limits" className="scroll-mt-6">
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-content">What this cannot do</h2>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <span className="font-semibold text-content">It detects, it does not predict.</span> It spots a move once the move has started. Every event marked on the charts was checked after the fact. The tracker has only run live since April 2026.
              </li>
              <li>
                <span className="font-semibold text-content">The yardstick catches up.</span> After a long crisis, the 12-month average rises to include the crisis itself. The flag can then drop back to Normal while prices are still high. European gas read Normal in May 2022, at $27.46, in the middle of the European gas crisis.
              </li>
              <li>
                <span className="font-semibold text-content">It cannot tell a recovery from a shortage.</span> The percentage test fires whenever a price is far above its recent average, even when the average collapsed first. European gas was flagged Critical in September 2020 at $3.85. That was cheap gas measured against a crashed baseline.
              </li>
              <li>
                <span className="font-semibold text-content">It only watches price.</span> It has no view on politics, weather or company decisions, except where a headline happens to mention them.
              </li>
            </ul>
          </Card>
        </section>

        <section id="data-sources" className="scroll-mt-6 space-y-3">
          <h2 className="text-sm font-semibold text-content">Where the numbers come from</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-edge text-xs text-muted">
                  <th scope="col" className="py-2 pr-4 font-semibold">Source</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">What it provides</th>
                  <th scope="col" className="py-2 font-semibold">How often</th>
                </tr>
              </thead>
              <tbody className="align-top text-muted">
                <tr className="border-b border-edge">
                  <td className="py-2 pr-4">US Energy Information Administration (EIA)</td>
                  <td className="py-2 pr-4">Oil and gas prices, US crude storage, world production</td>
                  <td className="py-2">Daily and weekly, published about 6 to 8 business days late</td>
                </tr>
                <tr className="border-b border-edge">
                  <td className="py-2 pr-4">FRED (Federal Reserve Bank of St. Louis)</td>
                  <td className="py-2 pr-4">European gas price, energy inflation</td>
                  <td className="py-2">Monthly</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">NewsAPI</td>
                  <td className="py-2 pr-4">Energy headlines</td>
                  <td className="py-2">Daily, about the last month only</td>
                </tr>
              </tbody>
            </table>
          </Card>
          <p className="text-sm text-muted">
            Coverage differs by commodity. WTI crude starts on 28 November 2006. Henry Hub gas starts on 2 January 2007. Brent crude starts on 11 January 2007. European gas starts on 1 January 1992. The whole dataset is rebuilt from scratch every weekday, so corrections published by the sources flow through automatically.
          </p>
          <p className="text-xs text-muted">
            For analytical purposes only. Not financial advice.
          </p>
        </section>

      </div>
    </main>
  );
}
