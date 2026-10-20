import fig1 from '../assets/figures/figure-1.svg';
import fig2 from '../assets/figures/figure-2.svg';
import fig3 from '../assets/figures/figure-3.svg';
import fig4 from '../assets/figures/figure-4.svg';
import fig5 from '../assets/figures/figure-5.svg';

// Full English text of the paper (v6). Kept in English on purpose: it is the original scientific text.
export default function ArticleText() {
  return (
    <article lang="en">
      <p className="article-authors">
        Zhakiyan Baktiyaruly, Damirlan Zhetpissov
      </p>
      <p className="article-title">
        Command Age Timeouts and Braking Strength in Simulated Vehicle Following
      </p>
      <p className="article-center">
        International IT University, Almaty, Kazakhstan
      </p>
      <p className="article-center">
        39579@iitu.edu.kz; 39514@iitu.edu.kz
      </p>
      <h3 className="article-h">
        Abstract
      </h3>
      <p className="article-p">
        A remote command can become too old to guide a moving vehicle. A backup may help, but its effect depends on brake strength, fault timing, and its action after a timeout. This study compares age limits and control architectures in a two vehicle model, without claiming to isolate early action or fresh measurements. Shared cases cover a braking leader and a leader that keeps its speed. Tests impose low delay, jitter, loss, and fixed or random outage starts. The data contain 107,200 runs based on four hundred physical cases. Collision counts and cruise distance costs are shown across the threshold sweep. Nearby limits reveal a switching boundary rather than a smooth response in the jitter profile. At the primary age limit, Remote 7 has fewer braking collisions and less cruise distance loss than Stop 7 in the loss and random outage profiles. Stop 7 avoids more collisions only under the deliberately hazard aligned fixed outage, at a cruise distance loss of about thirty five percent. This is strong nominal control versus weak nominal control with strong backup; their combination was not tested. Stratifying random outages by overlap with the full lead braking interval places most of the equal force Stop 3 benefit in the overlap group. Strong Stop 7 also helps outside that group. Full case contact scores and collision free intervention metrics complement event counts. Clock checks remain illustrative. These conditional comparisons describe the model and sampled faults, not an optimal timeout, a safety guarantee, or isolated causal effects.
      </p>
      <p className="article-p">
        Keywords: remote control, command age, fallback, braking, vehicle following, simulation
      </p>
      <h3 className="article-h">
        1 Introduction
      </h3>
      <p className="article-p">
        A remote control loop can fail through information timing even when its command computation is correct. Sampling, transmission, and packet loss determine which observation still governs the actuator [1]. Vehicular edge computing offers nearby computational resources, but does not remove dependence on communications [2]. This motivates local behavior when commands cease to be timely.
      </p>
      <p className="article-p">
        Command age is the elapsed time since the observation underlying the newest accepted command. It differs from the delay of an individual delivered message and grows between updates [3]. A timeout can trigger local action, but a comparison that also changes braking force cannot identify a pure timing effect. This article therefore evaluates equal force stopping, stronger stopping, and local control as distinct alternatives. It studies a simplified remote loop, not an edge resource scheduler or a trained driving policy.
      </p>
      <h3 className="article-h">
        2 Related work and research gap
      </h3>
      <p className="article-p">
        Safe control research separates performance improvement from claims of constraint satisfaction. Brunke et al. review this distinction across control and learning approaches [4]. It motivates reporting both adverse events and intervention costs, but it does not provide a safety certificate for the timeout policy implemented here.
      </p>
      <p className="article-p">
        Related work includes cooperative adaptive cruise control. Alsuhaim et al. adapt following headway to network reliability, including packet burst effects [5]. Their work highlights a key alternative to unconditional braking: change control behavior using network status and local measurements. The present study has two vehicles rather than a platoon and does not test string stability. Its local fallback baseline is therefore a component comparison, not a reproduction of that cooperative controller.
      </p>
      <p className="article-p">
        Runtime assurance switches authority between control components. Black Box Simplex formalizes such supervision [6], and Simplex Drive applies related ideas to learning enabled vehicle control [7]. Their guarantees depend on specific reasoning and assumptions absent here. Our arbiter changes behavior solely from age and recovery checks. A local proportional following controller is evaluated as an entire alternative with 10 ms updates, ideal measurements, and no transmission delay; its individual advantages are not separated.
      </p>
      <p className="article-p">
        Control barrier functions [8], predictive safety filters [9], and Responsibility Sensitive Safety [10] use information about physical state and constraints. These are important boundaries on what a clock alone can establish. Identical command ages can coexist with different gaps, closing speeds, and feasible stopping distances. The present experiment isolates a timeout response; it does not implement these state based safety methods.
      </p>
      <p className="article-p">
        Testing surveys distinguish module tests from complete system validation [11], while formal certification reviews describe stronger forms of evidence [12]. SafeBench [13] and dense reinforcement learning for safety validation [14] demonstrate the importance of informative critical scenarios. Our fixed braking and cruise families provide interpretable controls, but lack the breadth of those testing frameworks and do not estimate naturalistic crash frequency.
      </p>
      <p className="article-p">
        Metric choice also depends on the scenario. Westhofen et al. explain the suitability limits of time to collision and other criticality measures [15]. Scenario generation methods [16] and simulator comparisons [17] reinforce the need to specify the tested domain. We therefore use longitudinal time to collision only while closing and report relative speed at sampled contact separately. Travel in a collision terminated episode is not a successful trip metric.
      </p>
      <p className="article-p">
        Delay compensation is another alternative to stopping. Takuma et al. describe a predictive display for delayed remote driving in their published abstract [18]; Zhang et al. review communication delay and compensation in platoons [19]. Neither mechanism is implemented here, so no superiority over prediction based control is claimed. Finally, modern bootstrap comparisons show that interval quality depends on the statistic and method [20]. Our paired percentile intervals are exploratory and do not cover structural model error.
      </p>
      <p className="article-p">
        The contribution is a case study comparing brake strength and complete backup alternatives, with their intervention costs. The analysis is exploratory, not a preregistered confirmatory test or a new assurance architecture. The next section fixes explicit contrasts rather than broad claims of improved autonomous driving.
      </p>
      <h3 className="article-h">
        3 Research questions and experimental design
      </h3>
      <p className="article-p">
        RQ1 asks whether timeout stopping still reduces collisions when its maximum deceleration equals the nominal controller limit of 3 m/s2. RQ2 asks how much the outcome changes when backup deceleration becomes 4 or 7 m/s2 with the same age rule. RQ3 asks what stopping costs when the lead vehicle never brakes, relative to switching to fresh local following control. A small timing subset illustrates implementation sensitivity; it is not a separate robustness research question.
      </p>
      <p className="article-p">
        RQ4 asks how Remote 7 versus Stop 7 compares in collisions and cruise cost under fixed versus random outage timing, with P2 as a loss reference. This is an exploratory question, not a preregistered one.
      </p>
      <p className="article-p">
        These questions define descriptive paired contrasts. The primary backup comparison uses 200 ms. Added force comparisons at 190 and 210 ms in P1/P2 test dependence on that boundary. No share of the total benefit is assumed stable across thresholds. Figure 1 separates the delayed command path from the two local backup actions.
      </p>
      <figure>
        <img alt="Figure 1. UML sequence of delayed commands and alternative local backup actions." src={fig1} />
        <figcaption>
          Figure 1. UML sequence of delayed commands and alternative local backup actions.
        </figcaption>
      </figure>
      <h3 className="article-h">
        4 Materials and methods
      </h3>
      <p className="article-p">
        Four hundred physical cases are generated with a fixed seed and shared across all configurations. Each case has two scenario versions: the leader brakes, or it maintains its initial speed throughout 10 s. New source phases are independently drawn from 0, 10, 20, 30, and 40 ms and shared across configurations. This randomizes alignment on the 10 ms grid; it does not model arbitrary continuous phase or clock drift.
      </p>
      <p className="article-p">
        The core contains 23 configurations per profile and scenario: four references, one local fallback, and 18 stopping conditions. Across four profiles and two scenarios this gives 73,600 runs. A supplementary 60 to 250 ms sweep at 10 ms spacing adds 25,600 nonduplicate runs for force 3 in P1/P2. A targeted extension adds 3,200 braking episodes for forces 4/7 at 190/210 ms in P1/P2 and 4,800 episodes for six controls in both scenarios with random outage onset. Total main execution is 107,200 episodes. Repeated local baselines across profiles are identical references, not extra independent evidence.
      </p>
      <p className="article-p">
        Two point masses represent the follower front and leader rear on one lane; their position difference is gap g. Initial speeds are equal and uniform from 8 to 16 m/s. Initial gap is uniform from 8 to 28 m. In braking scenarios the lead deceleration is uniform from 3 to 7 m/s2, with onset uniform from 1.75 to 2.25 s and rounded upward to a 10 ms tick. Cruise scenarios retain the same inputs but suppress the braking event. Inputs are independent synthetic draws, not recorded traffic.
      </p>
      <h3 className="article-h">
        4.1 Physical and communication assumptions
      </h3>
      <p className="article-p">
        Equation (1) defines the proportional following controller, with follower speed v and leader speed vL. The default braking limit b is 3 m/s2. A stronger local and a stronger remote reference use b = 7. The latter tests whether the weak nominal brake limit contributes to adverse outcomes even without changing age handling.
      </p>
      <p className="article-eq">
        u = clip(0.7[g - (3 + 1.2v)] + 0.9[vL - v], -b, 1.5). (1)
      </p>
      <p className="article-p">
        Remote commands are generated every 50 ms at each case specific phase. A combined delay models sensing, processing, and return; no edge queue or offloading advantage is modeled. The receiver holds the latest accepted command and rejects older timestamps. A zero acceleration command at timestamp zero initializes the receiver. Fixed P3 always contains lead brake onset, making it a deliberately hazard aligned stress schedule, not a neutral outage sample or a proved worst case. P3R independently draws each outage start uniformly from 0 to 8.5 s, with duration 1.5 s and seed 20261022; one shared start is used across controls and scenarios for each case.
      </p>
      <div className="reader-table">
        <p className="figcaption">
          Table 1. Imposed network profiles and compared controllers
        </p>
        <table>
          <tr>
            <th>
              Item
            </th>
            <th>
              Definition
            </th>
          </tr>
          <tr>
            <td>
              P0
            </td>
            <td>
              20 ms combined delay, no loss
            </td>
          </tr>
          <tr>
            <td>
              P1
            </td>
            <td>
              Uniform 80 to 160 ms delay, no loss
            </td>
          </tr>
          <tr>
            <td>
              P2
            </td>
            <td>
              P1 delay draws plus 10% independent transaction loss
            </td>
          </tr>
          <tr>
            <td>
              P3
            </td>
            <td>
              20 ms delay; hazard aligned outage [1.5, 3.0) s
            </td>
          </tr>
          <tr>
            <td>
              P3R
            </td>
            <td>
              20 ms delay; random start U[0,8.5] s, duration 1.5 s
            </td>
          </tr>
          <tr>
            <td>
              Off / Remote 7
            </td>
            <td>
              No fallback; nominal brake limit 3 / 7 m/s2
            </td>
          </tr>
          <tr>
            <td>
              Stop 3 / 4 / 7
            </td>
            <td>
              Fallback applies constant -3 / -4 / -7 m/s2
            </td>
          </tr>
          <tr>
            <td>
              Switch 3
            </td>
            <td>
              Fallback applies fresh local controller, limit 3 m/s2
            </td>
          </tr>
          <tr>
            <td>
              Local 3 / 7
            </td>
            <td>
              Always use fresh local controller, limit 3 / 7 m/s2
            </td>
          </tr>
        </table>
      </div>
      <p className="article-p">
        The six core stopping thresholds are 50, 100, 150, 200, 250, and 400 ms for every brake strength. Switch 3 uses 200 ms. Local control is evaluated every 10 ms with current simulated measurements. P1/P2 share delays deliberately so that their difference adds loss to matched inputs. Only one trace per physical case/profile is generated; physical and network variance are not separately estimated.
      </p>
      <figure>
        <pre>
          {"def nominal(g,v,vl,limit=3):\n    return np.clip(.7*(g-(3+1.2*v))+.9*(vl-v),-limit,1.5)\n\ndef advance(x,v,a,dt):\n    # Exact position integral for constant acceleration, including a stop.\n    moving = np.where((a<0)&(v+a*dt<0),np.divide(-v,a,out=np.zeros_like(v),where=a!=0),dt)\n    moving = np.clip(moving,0,dt)\n    return x+v*moving+.5*a*moving*moving, np.maximum(0,v+a*dt)"}
        </pre>
        <figcaption>
          Listing 1. Actual following law and exact within step stopping integration; long lines wrap.
        </figcaption>
      </figure>
      <h3 className="article-h">
        4.2 Switching metrics and statistical analysis
      </h3>
      <p className="article-p">
        The main local arbiter checks every 10 ms. Command age is A(t) = t - s_latest, where s_latest is the source timestamp of the newest accepted command. Fallback begins when A exceeds the threshold by more than 1e-7 ms. Recovery checks occur at global times 0, 50, 100 ms and so on, independently of the randomized command generation phase. At a fresh recovery check, a counter increments; three eligible checks release fallback. Any stale local check resets the counter. This rule is shared by the stopping and local following backups.
      </p>
      <p className="article-p">
        Motion uses exact constant acceleration position integration within each 10 ms step, including a stop within the step. Speed cannot become negative. Collision is the first sampled nonpositive gap; motion and exposure accumulation then stop. Relative contact speed is max(v - vL, 0) at the end of that step. It approximates contact severity but is not continuous time impact reconstruction, injury risk, or collision energy.
      </p>
      <p className="article-p">
        Let t_b denote the lead braking onset rounded up to the 10 ms grid, v0 the initial lead speed, and a_L the positive magnitude of lead deceleration. The untruncated lead braking interval is [t_b, t_b + v0/a_L). An outage overlaps it if the intersection has positive duration. This interval uses exogenous lead motion even if the follower has already collided. Overlap does not imply command loss during that interval or identify a causal timing mechanism. Strata are defined without selecting controller outcomes.
      </p>
      <p className="article-p">
        Near exposure counts precontact time with g/(v - vL) below 1.5 s while closing. Outcomes also include forward distance, backup duration, backup entries, and stopped time while the leader moves above 0.1 m/s. The principal contact metric J is the mean squared relative contact speed over all 400 cases, with zero for noncollision. Its unit is m2/s2. This avoids conditioning on collision but is still not energy or injury risk. Cruise travel is a cleaner nuisance intervention measure than collision truncated braking travel.
      </p>
      <p className="article-p">
        Each configuration/profile/scenario cell contains 400 matched cases. Wilson intervals describe cell collision proportions. Ten thousand paired bootstrap resamples preserve case indices for differences in collision indicator, distance, near exposure, stopped time, and squared relative contact speed. The last is a descriptive severity proxy, not energy. All contrast tables are supplied. No multiplicity adjustment or confirmatory claim is made; zero event bootstrap differences cannot demonstrate equivalence.
      </p>
      <h3 className="article-h">
        4.3 Checks of event timing and recovery
      </h3>
      <p className="article-p">
        A disjoint 20 case pilot tests three brake forces, both scenarios, and four profiles: 480 episodes excluded from main estimates. Assertions check stopping integration, acceleration clipping, reference invariance, and finite outputs. An illustrative 100 case subset tests eight variants in P1/P2, totaling 1,600 runs. It has no confirmatory intervals and is not used to infer phase invariance. These vary phase alignment, strict versus inclusive timeout, local checks, and recovery count.
      </p>
      <p className="article-p">
        The 5 ms variant jointly refines physics, delivery rounding, and local checks. The 20 ms variant changes the local clock; recovery eligibility then intersects the 50 ms grid every 100 ms. These are implementation variants, not isolated physics convergence tests. The tolerance remains fixed. These checks address event implementation rather than establishing physics convergence.
      </p>
      <h3 className="article-h">
        5 Results
      </h3>
      <h3 className="article-h">
        5.1 Equal force stopping and baseline controls
      </h3>
      <p className="article-p">
        Table 2 reports all references and 200 ms backups. In P2, Stop 3 minus Off is -4.25 percentage points [-6.75,-2.00]; Stop 4 minus Stop 3 is -10.25 points [-13.25,-7.50]. Figure 2 includes Off and leaves adjacent thresholds unconnected because a switching boundary need not be smooth.
      </p>
      <div className="reader-table">
        <p className="figcaption">
          Table 2. Braking scenario collision events out of 400 per cell
        </p>
        <table>
          <tr>
            <th>
              Control
            </th>
            <th>
              P0 events
            </th>
            <th>
              P1 events
            </th>
            <th>
              P2 events
            </th>
            <th>
              P3 events
            </th>
          </tr>
          <tr>
            <td>
              Off
            </td>
            <td>
              88
            </td>
            <td>
              112
            </td>
            <td>
              112
            </td>
            <td>
              303
            </td>
          </tr>
          <tr>
            <td>
              Stop 3
            </td>
            <td>
              88
            </td>
            <td>
              112
            </td>
            <td>
              95
            </td>
            <td>
              4
            </td>
          </tr>
          <tr>
            <td>
              Stop 4
            </td>
            <td>
              88
            </td>
            <td>
              112
            </td>
            <td>
              54
            </td>
            <td>
              0
            </td>
          </tr>
          <tr>
            <td>
              Stop 7
            </td>
            <td>
              88
            </td>
            <td>
              112
            </td>
            <td>
              13
            </td>
            <td>
              0
            </td>
          </tr>
          <tr>
            <td>
              Switch 3
            </td>
            <td>
              88
            </td>
            <td>
              112
            </td>
            <td>
              107
            </td>
            <td>
              77
            </td>
          </tr>
          <tr>
            <td>
              Local 3
            </td>
            <td>
              77
            </td>
            <td>
              77
            </td>
            <td>
              77
            </td>
            <td>
              77
            </td>
          </tr>
          <tr>
            <td>
              Local 7
            </td>
            <td>
              0
            </td>
            <td>
              0
            </td>
            <td>
              0
            </td>
            <td>
              0
            </td>
          </tr>
          <tr>
            <td>
              Remote 7
            </td>
            <td>
              0
            </td>
            <td>
              0
            </td>
            <td>
              0
            </td>
            <td>
              12
            </td>
          </tr>
        </table>
      </div>
      <p className="article-p">
        Fixed P3 gives 4 events with Stop 3 versus 303 with Off: -74.75 percentage points [-78.75,-70.50]. This equal force reduction occurs under a hazard aligned schedule and does not identify a benefit of age triggering over other early stopping rules.
      </p>
      <figure>
        <img alt="Figure 2. Neighboring thresholds with 95% Wilson bars and Off reference. Marker offsets separate overlapping forces within each threshold; no interpolation is implied." src={fig2} />
        <figcaption>
          Figure 2. Neighboring thresholds with 95% Wilson bars and Off reference. Marker offsets separate overlapping forces within each threshold; no interpolation is implied.
        </figcaption>
      </figure>
      <p className="article-p">
        In P1, forces 3/4/7 give 82/35/3 events at 190 ms, but 112/112/112 at 200 and 210 ms, where backup is inactive. In P2, counts are 55/7/0, 95/54/13, and 98/65/22. Stop 3 minus Off equals -14.25/-4.25/-3.50 percentage points; extra reductions for force 3 to 4 are 12.00/10.25/8.25 points, with paired 95% intervals [9.00,15.25], [7.50,13.25], [5.75,11.00]. The equal force share of the total Off-to-Stop 7 reduction is 50.9%/17.2%/15.6%. These descriptive ratios are not causal components; the brake increment varies less than the equal force contrast.
      </p>
      <h3 className="article-h">
        5.2 Contact and collision free intervention outcomes
      </h3>
      <p className="article-p">
        Table 3 uses all 400 braking cases per cell for events and J, with zero contact score for noncollisions. Cruise distance and the starred backup time and entry count use 400 nonbraking cases, all without collisions, so intervention metrics are not truncated by a collision. P0/P1 inactive backup rows are collapsed. Local references are identical across profiles and shown once; no new P3R local runs are counted.
      </p>
      <div className="reader-table">
        <p className="figcaption">
          Table 3. Main 200 ms outcomes and complete architecture references
        </p>
        <table>
          <tr>
            <th>
              Profile / control
            </th>
            <th>
              Events
            </th>
            <th>
              J m2/s2
            </th>
            <th>
              Cruise m
            </th>
            <th>
              Backup s*
            </th>
            <th>
              Entries*
            </th>
          </tr>
          <tr>
            <td>
              P0 / Off, S3/4/7, Sw3
            </td>
            <td>
              88
            </td>
            <td>
              3.465
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P0 / Remote 7
            </td>
            <td>
              0
            </td>
            <td>
              0.000
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P1 / Off, S3/4/7, Sw3
            </td>
            <td>
              112
            </td>
            <td>
              4.998
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P1 / Remote 7
            </td>
            <td>
              0
            </td>
            <td>
              0.000
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              All / Local 3
            </td>
            <td>
              77
            </td>
            <td>
              3.045
            </td>
            <td>
              121.22
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              All / Local 7
            </td>
            <td>
              0
            </td>
            <td>
              0.000
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P2 / Off
            </td>
            <td>
              112
            </td>
            <td>
              5.098
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P2 / Stop 3
            </td>
            <td>
              95
            </td>
            <td>
              3.922
            </td>
            <td>
              119.38
            </td>
            <td>
              1.726
            </td>
            <td>
              10.38
            </td>
          </tr>
          <tr>
            <td>
              P2 / Stop 4
            </td>
            <td>
              54
            </td>
            <td>
              1.875
            </td>
            <td>
              117.21
            </td>
            <td>
              1.726
            </td>
            <td>
              10.38
            </td>
          </tr>
          <tr>
            <td>
              P2 / Stop 7
            </td>
            <td>
              13
            </td>
            <td>
              0.225
            </td>
            <td>
              102.37
            </td>
            <td>
              1.726
            </td>
            <td>
              10.38
            </td>
          </tr>
          <tr>
            <td>
              P2 / Switch 3
            </td>
            <td>
              107
            </td>
            <td>
              4.668
            </td>
            <td>
              121.21
            </td>
            <td>
              1.726
            </td>
            <td>
              10.38
            </td>
          </tr>
          <tr>
            <td>
              P2 / Remote 7
            </td>
            <td>
              0
            </td>
            <td>
              0.000
            </td>
            <td>
              121.21
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P3 / Off
            </td>
            <td>
              303
            </td>
            <td>
              39.132
            </td>
            <td>
              121.22
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P3 / Stop 3
            </td>
            <td>
              4
            </td>
            <td>
              0.068
            </td>
            <td>
              116.00
            </td>
            <td>
              1.480
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3 / Stop 4
            </td>
            <td>
              0
            </td>
            <td>
              0.000
            </td>
            <td>
              109.13
            </td>
            <td>
              1.480
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3 / Stop 7
            </td>
            <td>
              0
            </td>
            <td>
              0.000
            </td>
            <td>
              78.91
            </td>
            <td>
              1.480
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3 / Switch 3
            </td>
            <td>
              77
            </td>
            <td>
              3.079
            </td>
            <td>
              121.21
            </td>
            <td>
              1.480
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3 / Remote 7
            </td>
            <td>
              12
            </td>
            <td>
              0.480
            </td>
            <td>
              121.23
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P3R / Off
            </td>
            <td>
              126
            </td>
            <td>
              10.312
            </td>
            <td>
              121.19
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
          <tr>
            <td>
              P3R / Stop 3
            </td>
            <td>
              73
            </td>
            <td>
              2.614
            </td>
            <td>
              114.50
            </td>
            <td>
              1.479
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3R / Stop 4
            </td>
            <td>
              42
            </td>
            <td>
              1.156
            </td>
            <td>
              109.05
            </td>
            <td>
              1.479
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3R / Stop 7
            </td>
            <td>
              29
            </td>
            <td>
              0.906
            </td>
            <td>
              89.10
            </td>
            <td>
              1.479
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3R / Switch 3
            </td>
            <td>
              86
            </td>
            <td>
              3.422
            </td>
            <td>
              121.21
            </td>
            <td>
              1.479
            </td>
            <td>
              1.00
            </td>
          </tr>
          <tr>
            <td>
              P3R / Remote 7
            </td>
            <td>
              5
            </td>
            <td>
              0.181
            </td>
            <td>
              120.99
            </td>
            <td>
              0.000
            </td>
            <td>
              0.00
            </td>
          </tr>
        </table>
      </div>
      <p className="article-p">
        Abbreviations in the collapsed rows: S3 = Stop 3, S4 = Stop 4, S7 = Stop 7, and Sw3 = Switch 3. Remote and always local references have no backup activation. In P2, J is 5.098 for Off and 3.922 for Stop 3: paired difference -1.176 m2/s2 [-1.572,-0.811]. This descriptive score combines contact frequency and speed; it is not injury risk.
      </p>
      <p className="article-p">
        Remote 7 uses nominal brake limit 7 with no backup; Stop 7 uses nominal limit 3 and backup limit 7. At 200 ms, Remote 7 has fewer collisions and less cruise loss in P2 (0 versus 13; about 0 versus 18.84 m) and P3R (5 versus 29; 0.20 versus 32.10 m). Stop 7 avoids more collisions only in deliberately hazard aligned fixed P3 (0 versus 12), at a loss of 42.31 m, or 34.9%, against approximately zero for Remote 7. These are two scenario-specific metrics, not a single measure of trip utility.
      </p>
      <h3 className="article-h">
        5.3 Outage exposure and conditional rankings
      </h3>
      <p className="article-p">
        Of 400 random P3R outages, 186 overlap the full untruncated lead braking interval and 214 do not; 66 contain onset. Figure 3 stratifies by interval overlap. These strata describe exposure to lead braking, not a randomized comparison between strata; braking duration also depends on the sampled speed and deceleration.
      </p>
      <figure>
        <img alt="Figure 3. P3R counts and proportions by braking interval overlap. S3/4/7 denote stop force, Sw3 is Switch 3, R7 is Remote 7; backups use 200 ms. Each panel has its own stated denominator." src={fig3} />
        <figcaption>
          Figure 3. P3R counts and proportions by braking interval overlap. S3/4/7 denote stop force, Sw3 is Switch 3, R7 is Remote 7; backups use 200 ms. Each panel has its own stated denominator.
        </figcaption>
      </figure>
      <p className="article-p">
        Within the overlap group, Off/Stop 3 events are 81/30 of 186; without overlap they are 45/43 of 214. Matched P0 Off counts are 41 and 47, respectively: P3R Off excess is +40 and -2. Thus the net excess of 38 is concentrated in the overlap stratum, and the Stop 3 reduction of 53 decomposes into 51 and 2 events. This is descriptive stratification, not evidence that overlap alone causes every excess collision. Nonoverlap can still allow carryover from an earlier outage. Within-stratum counts and differences are descriptive; no within-stratum contrast intervals are reported. The concentration of 51 of 53 avoided events refers to equal force Stop 3: Stop 7 also reduces nonoverlap events from 45 to 29, alongside 81 to zero in the overlap group.
      </p>
      <p className="article-p">
        The pooled P3R comparison differs from its overlap group: Remote 7 versus Stop 7 gives 5/29 overall, but 5/0 within overlap. At P2 190 ms they tie at zero events; at 210 ms the counts are 0/22. The primary 200 ms comparisons in Table 3 therefore describe specified profiles and thresholds, not a universal architecture ranking.
      </p>
      <p className="article-p">
        Overall P3R Stop 3 minus Off remains -13.25 percentage points [-16.75,-10.00], with J difference -7.698 m2/s2 [-10.151,-5.464]. The illustrative P1 100-case subset gives 30/21/27 events for random-phase strict, random-phase inclusive, and the joint 5 ms implementation variant. It establishes no clock robustness.
      </p>
      <h3 className="article-h">
        5.4 Threshold sweep results
      </h3>
      <figure>
        <img alt="Figure 4. Collision proportion versus cruise distance loss relative to Off in P1/P2. Every available paired threshold is retained: 22 for Stop 3 (50 to 250 ms by 10 ms, plus 400), six for Stop 4/7 (50,100,150,200,250,400). Reference points include Off and Local 3; Remote 7 and Local 7 overlap near zero loss and zero events. The new force 4/7 neighbor tests have braking data only and are therefore excluded from this paired plot." src={fig4} />
        <figcaption>
          Figure 4. Collision proportion versus cruise distance loss relative to Off in P1/P2. Every available paired threshold is retained: 22 for Stop 3 (50 to 250 ms by 10 ms, plus 400), six for Stop 4/7 (50,100,150,200,250,400). Reference points include Off and Local 3; Remote 7 and Local 7 overlap near zero loss and zero events. The new force 4/7 neighbor tests have braking data only and are therefore excluded from this paired plot.
        </figcaption>
      </figure>
      <div className="reader-table">
        <p className="figcaption">
          Table 4. Events / cruise loss (m), 400 cases per cell; S3/S4/S7 = Stop 3/4/7
        </p>
        <table>
          <tr>
            <th>
              Limit ms
            </th>
            <th>
              P1 S3
            </th>
            <th>
              P1 S4
            </th>
            <th>
              P1 S7
            </th>
            <th>
              P2 S3
            </th>
            <th>
              P2 S4
            </th>
            <th>
              P2 S7
            </th>
          </tr>
          <tr>
            <td>
              100
            </td>
            <td>
              0 / 94.568
            </td>
            <td>
              0 / 100.893
            </td>
            <td>
              0 / 109.025
            </td>
            <td>
              0 / 94.567
            </td>
            <td>
              0 / 100.892
            </td>
            <td>
              0 / 109.025
            </td>
          </tr>
          <tr>
            <td>
              150
            </td>
            <td>
              0 / 91.471
            </td>
            <td>
              0 / 98.446
            </td>
            <td>
              0 / 107.308
            </td>
            <td>
              0 / 92.151
            </td>
            <td>
              0 / 98.930
            </td>
            <td>
              0 / 107.574
            </td>
          </tr>
          <tr>
            <td>
              200
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              95 / 1.830
            </td>
            <td>
              54 / 4.008
            </td>
            <td>
              13 / 18.839
            </td>
          </tr>
          <tr>
            <td>
              250
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              109 / 0.086
            </td>
            <td>
              105 / 0.118
            </td>
            <td>
              98 / 0.281
            </td>
          </tr>
          <tr>
            <td>
              400
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.000
            </td>
            <td>
              112 / 0.001
            </td>
            <td>
              112 / 0.001
            </td>
            <td>
              112 / 0.002
            </td>
          </tr>
        </table>
      </div>
      <p className="article-p">
        Cruise loss is Off distance minus the stopping control distance. Table 4 gives five limits for each force; Figure 4 retains the complete paired grid. In P2, Stop 3 at 100 ms avoids all observed collisions but loses 94.57 m; at 200 ms it has 95 events and loses 1.83 m. These axes use matched braking and cruise versions, not a fitted optimum or joint trip utility.
      </p>
      <h3 className="article-h">
        6 Discussion
      </h3>
      <p className="article-p">
        Thresholds below the normal command age envelope act as negative controls, not proposed operating points. With 50 ms generation and 20 ms delay, continuous age approaches 70 ms before the next delivery; Deliveries are processed before decisions, so the sampled age peaks at 60 ms on the 10 ms grid. A 50 ms threshold can therefore repeatedly engage backup even without network loss. Its low collision count can come from suppressing movement, as cruise loss makes visible.
      </p>
      <p className="article-p">
        The P1 boundary at 200 ms is specific to strict age comparison, 10 ms quantization, processing deliveries before decisions, and recovery hysteresis. At 190 ms backup engages; at 200/210 ms it remains inactive in the main P1 trace. Inclusive comparison or altered event clocks can change this. The 30/21/27 subset is an implementation illustration, not a convergence test or evidence that 200 ms is a safe limit.
      </p>
      <p className="article-p">
        In fixed P3 cruise, Stop 3 travels 116.00 m versus Switch 3 at 121.21 m: paired difference -5.21 m [-5.74,-4.71]. This contrasts stopping with continuing local following on the same maximum brake limit. It does not isolate freshness, because Switch 3 also changes update rate and delay. The cruise result avoids collision truncation but does not measure comfort or real traffic utility.
      </p>
      <h3 className="article-h">
        6.1 Limits and conclusion
      </h3>
      <p className="article-p">
        The point mass model omits perception error, actuator lag, friction, road geometry, pedestrians, lateral control, and vehicles behind the follower. Independent uniform inputs do not represent road exposure. One network trace per physical case/profile prevents a separate variance decomposition. Random source phase is restricted to the local grid. There is no processor queue, learned policy, predictor baseline, formal stopping invariant, or exhaustive corner analysis. The timing checks cover only 100 cases and do not vary numeric tolerance. A strong nominal controller combined with backup was not tested. P3R uses only one sampled outage window per physical case, from seed 20261022; repeated independent outage draws are not evaluated.
      </p>
      <p className="article-p">
        The 107,200 executed main episodes reuse 400 independent physical draws; they are not 107,200 independent samples. Confidence intervals quantify sampling of these joint cases and traces; they do not cover model error. A zero event cell has a Wilson upper 95% bound of approximately 0.951% under this input distribution. That bound is not a public road risk estimate.
      </p>
      <h3 className="article-h">
        7 Conclusion
      </h3>
      <p className="article-p">
        At 200 ms, Remote 7 has fewer braking collisions and less cruise loss than Stop 7 in P2 and P3R. Stop 7 prevents more collisions only in the hazard aligned fixed P3 schedule, at a 34.9% cruise distance loss. This asymmetric tradeoff compares strong nominal control with weak nominal control plus strong backup; their untested combination remains open. Most of the equal force Stop 3 benefit lies in overlapping outages, while Stop 7 also helps without overlap. Early action and freshness remain unisolated, and no safe deployment timeout is established.
      </p>
      <h3 className="article-h">
        Implementation evidence and availability
      </h3>
      <p className="article-p">
        Release MT1-v6-20261018 is supplied as MT1_v6_Source_Package.zip with SHA256.json file checksums. It retains all 107,200 main runs and adds descriptive reanalysis, not new simulations. Listing 1 in the methods records actual code; Figure 5 shows the generated outage exposure rather than selected example cases.
      </p>
      <figure>
        <img alt="Figure 5. Generated random outage starts and exposure counts. Equal width histogram bins describe this synthetic draw, not a fitted radio failure distribution." src={fig5} />
        <figcaption>
          Figure 5. Generated random outage starts and exposure counts. Equal width histogram bins describe this synthetic draw, not a fitted radio failure distribution.
        </figcaption>
      </figure>
      <h3 className="article-h">
        References
      </h3>
      <h3 className="article-h">
        References continued
      </h3>
      <h3 className="article-h">
        Author information
      </h3>
      <p className="article-p">
        Zhakiyan Baktiyaruly. International IT University, Almaty, Kazakhstan. Email: 39579@iitu.edu.kz. Group: IT1CCO-2403IS.
      </p>
      <p className="article-p">
        Damirlan Zhetpissov. International IT University, Almaty, Kazakhstan. Email: 39514@iitu.edu.kz.
      </p>
    </article>
  );
}
