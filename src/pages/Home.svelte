<!-- 
    @component
    # The Home component.
    This is the home page for the application. It doesn't really do much, but it's a good place to start.
 -->

<div class="content">
    <div class="section">
    <div class="section-title">Microdosing on Randomness</div>
        <div class="section-subtitle">Increase Exploration, Reduce Decisions 🚶‍♀️</div>
        <p>
            Welcome, Meandering Fellow!
            Use this site to explore your <a href=/map>neighborhood</a> <a href=/map/restaurant>restaurants</a>, <a href="/map/bar">bars</a>, <a href="/map/coffee">coffee shops</a>, <a href="/map/park">parks</a> or <a href="/map/bookstore">bookstores</a>.
        </p>
    </div>

    <div class="section">
        <div class="section-title">Why should I randomize?</div>
        <p>Leaving some decisions to randomness will encourage exploration and reduce decision fatigue.</p>

        <ul>
            <li>
                If you want to explore a city, randomize the next bookstore or park you visit.
                You'll get to see those nooks and crannies of the city you wouldn't ordinarily visit
            </li>

            <li>
                If you want to reduce decision fatigue, and take a break from an ever-increasing set of choices.
                Tradeoff optimization for exploration and reduced decisions.
                Randomize the next restaurant, bar or coffee shop you visit
            </li>
        </ul>
    </div>
</div>

<style>
    .content {
        display: grid;
        grid-template-columns: min(60ch, calc(100% - 16px));
        max-width: 1800px;
        font-size: 20px;
    }
    .section {
        padding: 16px 32px 0px;
        line-height: 1.5;
    }
    .section-title {
        font-size: 24px;
        font-weight: normal;
    }
    .section-subtitle {
        font-size: 16px;
        font-style: italic;
    }

    .section {
        font-weight: lighter;
    }
</style>