import { useMemo, useState } from "react"

const YEARS = [2021, 2022, 2023, 2024, 2025] as const
type Year = typeof YEARS[number]

type RegionRow = {
  name: string
  values: Record<Year, number>
}

const rows: RegionRow[] = [
  {
    name: "전국",
    values: {
      2021: 12265601,
      2022: 12809657,
      2023: 13319909,
      2024: 13755125,
      2025: 14217668,
    },
  },
  {
    name: "서울특별시",
    values: {
      2021: 2206571,
      2022: 2279066,
      2023: 2349553,
      2024: 2405625,
      2025: 2467187,
    },
  },
  {
    name: "부산광역시",
    values: {
      2021: 934024,
      2022: 965387,
      2023: 997993,
      2024: 1020554,
      2025: 1039814,
    },
  },
  {
    name: "대구광역시",
    values: {
      2021: 588586,
      2022: 612655,
      2023: 648930,
      2024: 670502,
      2025: 692629,
    },
  },
  {
    name: "인천광역시",
    values: {
      2021: 638855,
      2022: 678410,
      2023: 716472,
      2024: 749937,
      2025: 787487,
    },
  },
  {
    name: "광주광역시",
    values: {
      2021: 306710,
      2022: 319736,
      2023: 333100,
      2024: 344416,
      2025: 356323,
    },
  },
  {
    name: "대전광역시",
    values: {
      2021: 317839,
      2022: 332117,
      2023: 345208,
      2024: 356569,
      2025: 369412,
    },
  },
  {
    name: "울산광역시",
    values: {
      2021: 234361,
      2022: 248451,
      2023: 262243,
      2024: 274427,
      2025: 287511,
    },
  },
  {
    name: "세종특별자치시",
    values: { 2021: 53464, 2022: 57387, 2023: 59947, 2024: 62740, 2025: 65658 },
  },
  {
    name: "경기도",
    values: {
      2021: 2715536,
      2022: 2872546,
      2023: 3023061,
      2024: 3163369,
      2025: 3314757,
    },
  },
  {
    name: "강원특별자치도",
    values: {
      2021: 454353,
      2022: 474360,
      2023: 490299,
      2024: 503689,
      2025: 516156,
    },
  },
  {
    name: "충청북도",
    values: {
      2021: 415112,
      2022: 434829,
      2023: 449877,
      2024: 462408,
      2025: 478762,
    },
  },
  {
    name: "충청남도",
    values: {
      2021: 555770,
      2022: 580382,
      2023: 600308,
      2024: 618775,
      2025: 638395,
    },
  },
  {
    name: "전북특별자치도",
    values: {
      2021: 513394,
      2022: 530632,
      2023: 546441,
      2024: 558207,
      2025: 570030,
    },
  },
  {
    name: "전라남도",
    values: {
      2021: 557592,
      2022: 574325,
      2023: 591190,
      2024: 604046,
      2025: 617711,
    },
  },
  {
    name: "경상북도",
    values: {
      2021: 785640,
      2022: 814516,
      2023: 828098,
      2024: 848956,
      2025: 868942,
    },
  },
  {
    name: "경상남도",
    values: {
      2021: 838066,
      2022: 878048,
      2023: 913452,
      2024: 941036,
      2025: 971191,
    },
  },
  {
    name: "제주특별자치도",
    values: {
      2021: 149728,
      2022: 156810,
      2023: 163737,
      2024: 169869,
      2025: 175703,
    },
  },
]

const cities = rows.slice(1)
const compact = new Intl.NumberFormat("ko-KR", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const number = new Intl.NumberFormat("ko-KR")

function makePoints(
  values: number[],
  width = 680,
  height = 300,
  normalized = false,
) {
  const pad = { left: 24, right: 22, top: 20, bottom: 34 }
  const min = normalized ? 0 : Math.min(...values) * 0.96
  const max = normalized ? 1 : Math.max(...values) * 1.02
  return values.map((value, index) => ({
    x:
      pad.left + index * ((width - pad.left - pad.right) / (values.length - 1)),
    y:
      pad.top +
      ((max - value) / (max - min || 1)) * (height - pad.top - pad.bottom),
    value,
  }))
}

function LineChart({ region }: { region: RegionRow }) {
  const values = YEARS.map((year) => region.values[year])
  const points = makePoints(values)
  const path = points
    .map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`)
    .join(" ")

  return (
    <div className="chart-wrap">
      <svg
        className="line-chart"
        viewBox="0 0 680 300"
        role="img"
        aria-label={`${region.name} 연도별 60세 이상 인구 추이`}
      >
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="24"
            x2="658"
            y1={30 + line * 68}
            y2={30 + line * 68}
            className="grid-line"
          />
        ))}
        <path d={path} className="main-line" />
        {points.map((point, index) => (
          <g key={YEARS[index]} className="data-point">
            <circle cx={point.x} cy={point.y} r="17" className="point-target" />
            <circle cx={point.x} cy={point.y} r="4.5" className="point-dot" />
            <text
              x={point.x}
              y={point.y - 16}
              textAnchor="middle"
              className="value-label"
            >
              {compact.format(point.value)}명
            </text>
            <text
              x={point.x}
              y="286"
              textAnchor="middle"
              className="axis-label"
            >
              {YEARS[index]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function RankingChart({ year }: { year: Year }) {
  const ranked = useMemo(
    () => [...cities].sort((a, b) => b.values[year] - a.values[year]),
    [year],
  )
  const maximum = ranked[0].values[year]

  return (
    <div
      className="ranking-list"
      aria-label={`${year}년 지역별 60세 이상 인구 순위`}
    >
      {ranked.map((region, index) => (
        <div className="rank-row" key={region.name}>
          <span className="rank-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rank-name">{region.name}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(region.values[year] / maximum) * 100}%` }}
            />
          </div>
          <span className="rank-value">
            {compact.format(region.values[year])}
          </span>
        </div>
      ))}
    </div>
  )
}

function NormalizedChart({
  active,
  onActiveChange,
}: {
  active: string
  onActiveChange: (name: string) => void
}) {
  const paths = cities.map((city) => {
    const values = YEARS.map((year) => city.values[year])
    const min = Math.min(...values)
    const max = Math.max(...values)
    const normalized = values.map((value) => (value - min) / (max - min || 1))
    const points = makePoints(normalized, 680, 300, true)
    return {
      city,
      values: normalized,
      path: points
        .map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`)
        .join(" "),
    }
  })
  const activeData = paths.find(({ city }) => city.name === active) ?? paths[0]

  return (
    <div className="normalized-layout">
      <div className="chart-wrap normalized-wrap">
        <svg
          className="line-chart"
          viewBox="0 0 680 300"
          role="img"
          aria-label="지역별 정규화 인구 추이"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = 20 + (1 - tick) * 246
            return (
              <g key={tick}>
                <line x1="24" x2="658" y1={y} y2={y} className="grid-line" />
                <text x="658" y={y - 7} textAnchor="end" className="axis-label">
                  {tick.toFixed(2)}
                </text>
              </g>
            )
          })}
          {paths
            .filter(({ city }) => city.name !== active)
            .map(({ city, path }) => (
              <path
                key={city.name}
                d={path}
                className="normalized-line"
                onMouseEnter={() => onActiveChange(city.name)}
              />
            ))}
          <path d={activeData.path} className="normalized-line active" />
          {YEARS.map((year, index) => {
            const x = 24 + index * (634 / (YEARS.length - 1))
            return (
              <text
                key={year}
                x={x}
                y="286"
                textAnchor="middle"
                className="axis-label"
              >
                {year}
              </text>
            )
          })}
        </svg>
      </div>
      <div className="region-legend" aria-label="지역 선택">
        {paths.map(({ city, values }) => (
          <button
            type="button"
            key={city.name}
            className={`legend-item ${city.name === active ? "active" : ""}`}
            onClick={() => onActiveChange(city.name)}
          >
            <span>{city.name}</span>
            <span className="legend-change">
              +{Math.round((city.values[2025] / city.values[2021] - 1) * 100)}%
            </span>
            <span className="legend-score">
              {values[values.length - 1].toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [selectedYear, setSelectedYear] = useState<Year>(2025)
  const [trendRegion, setTrendRegion] = useState("전국")
  const [activeRegion, setActiveRegion] = useState("경기도")
  const currentTrend = rows.find((row) => row.name === trendRegion) ?? rows[0]
  const national = rows[0]
  const growth = (
    (national.values[2025] / national.values[2021] - 1) *
    100
  ).toFixed(1)

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="데이터 아틀라스 홈">
          <span className="brand-mark">DA</span>
          <span>DATA ATLAS</span>
        </a>
        <div className="header-meta">
          <span>인구 · 고령화</span>
          <span className="live-dot" />
          <span>2025 업데이트</span>
        </div>
      </header>

      <div className="dashboard" id="top">
        <section className="hero">
          <div>
            <p className="eyebrow">KOREA SENIOR POPULATION / 2021—2025</p>
            <h1>
              한국의 고령인구,
              <br />
              <span>숫자로 읽다.</span>
            </h1>
          </div>
          <div className="hero-summary">
            <p>
              전국 17개 시도의 60세 이상 인구 변화와 지역별 격차를 한눈에
              살펴보세요.
            </p>
            <div className="hero-stat">
              <span>2025 전국</span>
              <strong>
                {compact.format(national.values[2025])}
                <small>명</small>
              </strong>
              <em>2021년 대비 +{growth}%</em>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-index">01</span>
              <p className="eyebrow">ANNUAL TREND</p>
              <h2>연도별 인구 추이</h2>
            </div>
            <label className="select-label">
              <span>지역 선택</span>
              <select
                value={trendRegion}
                onChange={(event) => setTrendRegion(event.target.value)}
              >
                {rows.map((row) => (
                  <option key={row.name}>{row.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="chart-card trend-card">
            <div className="chart-card-header">
              <div>
                <span className="card-kicker">{currentTrend.name}</span>
                <strong>
                  {number.format(currentTrend.values[2025])}
                  <small>명</small>
                </strong>
              </div>
              <p>60세 이상 인구 · 연말 기준</p>
            </div>
            <LineChart region={currentTrend} />
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading ranking-heading">
            <div>
              <span className="section-index">02</span>
              <p className="eyebrow">REGIONAL RANKING</p>
              <h2>지역별 인구 순위</h2>
            </div>
            <div className="year-tabs" aria-label="연도 선택">
              {YEARS.map((year) => (
                <button
                  type="button"
                  key={year}
                  className={selectedYear === year ? "active" : ""}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-card ranking-card">
            <div className="ranking-column-head">
              <span>순위 / 지역</span>
              <span>{selectedYear}년 60세 이상 인구</span>
            </div>
            <RankingChart year={selectedYear} />
          </div>
        </section>

        <section className="section-block normalized-section">
          <div className="section-heading">
            <div>
              <span className="section-index">03</span>
              <p className="eyebrow">NORMALIZED INDEX</p>
              <h2>도시별 변화의 속도</h2>
            </div>
            <p className="section-note">
              각 지역의 최솟값을 0, 최댓값을 1로 환산해
              <br />
              규모가 아닌 변화의 궤적을 비교합니다.
            </p>
          </div>
          <div className="chart-card normalized-card">
            <div className="chart-card-header">
              <div>
                <span className="card-kicker">현재 선택</span>
                <strong className="active-region-name">{activeRegion}</strong>
              </div>
              <div className="scale-key">
                <span>MIN</span>
                <i />
                <span>MAX</span>
              </div>
            </div>
            <NormalizedChart
              active={activeRegion}
              onActiveChange={setActiveRegion}
            />
          </div>
        </section>
      </div>

      <footer>
        <span>DATA SOURCE · data.csv</span>
        <span>단위: 명 · 60세 이상 계</span>
        <span>© 2025 DATA ATLAS</span>
      </footer>
    </main>
  )
}
