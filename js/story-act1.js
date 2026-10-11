/* ═══════════════════════════════════════════════════════════════
   《公海》第一幕 · 出海
   接船 → 假合同 → 出海 → 钓鱿 → 风声 → 「你们回不去了」
   → 劫船 → 第一个死者
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var A = '第一幕 · 出海';

  window.GH.Engine.register({

/* ─────────────────────────────────────────────────────────────
   序章
   ───────────────────────────────────────────────────────────── */

p_dock: {
  id: 'p_dock', act: A, day: 1, date: '2010 年 11 月', place: '石岛 · 电业码头',
  mood: 'calm', ambience: 'wind',
  text: [
    '石岛的码头有一股味道：柴油、碎冰、烂掉的鱼，还有铁锈。你站在跳板底下仰头看那条船，看了很久。',
    '鲁荣渔 7451 号。三四十米长，船身锈得像刚从海底捞上来。船头横着一根杆，两边各挂一排灯，一盏两千瓦，十几盏，白天看着也晃眼——那是给鱿鱼看的。',
    { t: '大勇在你旁边说：「就它了。」', cls: 'q' },
    '他说这话时挺高兴，好像那条船不是锈的，是新的；好像他不是欠着一屁股债，是要去挣一套房。',
    '你二十四。镇上那个烧烤摊，今年夏天一直在下雨，没挣着钱。你处了个对象，她家里问你能拿出什么，你答不上来。',
    '船上年薪四万五，还有提成。这是大勇打电话告诉你的。',
    '你没有理由不来。'
  ],
  choices: [
    { label: '问大勇：这船，靠谱吗？',
      to: 'p_firstnight',
      effect: { standing: +4, flags: { asked_reliable: true } } },
    { label: '不问。跟着上船。',
      to: 'p_firstnight',
      effect: { body: +2, flags: { kept_quiet: true } } },
    { label: '回头看一眼石岛的天，把这个地方记住。',
      to: 'p_firstnight',
      effect: { flags: { looked_back: true } } }
  ]
},

p_firstnight: {
  id: 'p_firstnight', act: A, day: 1, date: '接船第一夜', place: '鲁荣渔 7451 · 船员舱',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '接船的第一天就出了事。',
    '还没正式出海，只是上物资、大修机器。晚上八点多，船员舱里几个人在打牌。你在自己铺上拿手机看小说。',
    { t: '有人在过道上喊：「杀人了——杀人了——」', cls: 'shout' },
    '是做饭的严师傅，大连人，大副找来的。他在每一间舱里都喊，喊了快两个钟头。给他那屋的好几个人吓得不轻。',
    '快一点的时候，船长把他叫上去骂了一顿。他老实了，坐着不动。',
    '过了一会儿他自己出去了。大家都以为他去上厕所。',
    '他直接跳了海。',
    '那天正好降温，刮五六级北风。他从蚧口码头跳下去，往港口中间游。船出去找，找了半个多小时——天黑，什么都看不见。中间有艘抛锚的船发现了他，把他捞了上去。',
    { t: '大副当晚就把他送回了家。他家里人说，他脑袋多少受过点刺激，他妈死那年落下的。', cls: 'inner' },
    '第二天公司回话说：回家养几天就好了，还想上船——最后没用。'
  ],
  choices: [
    { label: '跟大勇嘀咕：这人是不是看见什么了？',
      to: 'p_pier',
      effect: { standing: +2, flags: { wondered_omen: true } } },
    { label: '什么都不说。这条船上没人认识你。',
      to: 'p_pier',
      effect: { standing: -2, body: +1, flags: { kept_quiet: true } } },
    { label: '去问大副：他到底怎么了？',
      to: 'p_pier',
      effect: { standing: +5, body: -3, flags: { asked_mate: true } } }
  ]
},

p_pier: {
  id: 'p_pier', act: A, day: 2, date: '接船第二天', place: '鲁荣渔 7451 · 甲板',
  mood: 'calm', ambience: 'wind',
  text: [
    '第二天早上，码头上的风向变了，从岸上吹过来，带着柴油机厂的味儿。',
    '船员们蹲在甲板上抽烟，聊昨晚那件事，聊得很起劲，也很轻松。有人说他是欠了赌债，有人说他老婆跑了，有人说他就是脑子有病。',
    '没有人提"他为什么喊杀人了"。',
    '换上来一个新厨师，姓周，也是大连人，四十多岁。老周话多，嘴碎，爱拍船长的马屁，总觉得自己年纪大、见过世面。',
    '他上船第一件事是去厨房把所有刀翻出来磨了一遍，一边磨一边跟人说：',
    { t: '「这船上要是有人敢胡来，我这刀可不认人。」', cls: 'q' },
    '大家笑。你也笑了。'
  ],
  choices: [
    { label: '跟老周搭话，混个脸熟。',
      to: 'p_papers',
      effect: { standing: +4, flags: { knows_cook: true } } },
    { label: '去找大勇，把船上的人都认一遍。',
      to: 'p_crew',
      effect: { standing: +2, flags: { met_crew: true } } },
    { label: '回铺上躺着。离开船还有几天。',
      to: 'p_papers',
      effect: { body: +4 } }
  ]
},

p_crew: {
  id: 'p_crew', act: A, day: 2, date: '接船第二天', place: '鲁荣渔 7451 · 甲板',
  mood: 'calm', ambience: 'wind',
  text: [
    '大勇拉着你在甲板上转了一圈，把人都指给你看。',
    '船长邵广海，个子很大，脾气也大。船员惹他不高兴，一拳就过去，眼圈当场就黑。船上有争执，他永远向着自己的老乡，再不然就是打耳光。',
    '大副孙立成，二副田志国，大管轮焦德发——都是船长的人。',
    '老韩，五十来岁，头发白了一半，以前跑过好几条船，说话慢。',
    '老葛，也是五十多，自己跟人说他弄死过人、劳改过两回。你后来才知道，他两次都是盗窃。',
    '还有一伙内蒙古人，说话你听不懂。领头那个叫巴雅尔，三十出头，肩膀很宽，不太跟外人说话，但他在的时候，那几个内蒙人都看他。',
    '最后大勇指了指船尾一个瘦子。',
    { t: '「那个叫贺松。当过兵。」', cls: 'q' },
    '贺松三十岁上下，个子不高，甚至有点瘦。他不怎么说话，眼神老是往人身后飘。你朝他点头，他也点头，但你觉得他点头的时候在想别的事。'
  ],
  choices: [
    { label: '主动去跟贺松说两句话。',
      to: 'p_papers',
      effect: { standing: +6, flags: { first_contact_he: true } } },
    { label: '跟老韩聊聊，问问这趟活儿到底怎么样。',
      to: 'p_papers',
      effect: { standing: +3, flags: { knows_han: true } } },
    { label: '一个人待着。人多了费神。',
      to: 'p_papers',
      effect: { body: +3, standing: -2 } }
  ]
},

/* ─────────────────────────────────────────────────────────────
   假合同
   ───────────────────────────────────────────────────────────── */

p_papers: {
  id: 'p_papers', act: A, day: 3, date: '出海前', place: '荣成 · 公司办公室',
  mood: 'calm', ambience: 'quiet',
  text: [
    '办海员证。说是上课，其实一共就三天，考试连抄带蒙，证基本就到手了。办证的钱公司出一部分，你自己出七千多——报名、路费、上船要带的东西。',
    '签合同的时候，你注意到一件事：公司那个人把章盖得很急，盖完就把纸抽回去了，没让你细看。',
    '你问了一句工资怎么算。他说合同上写着，一年四万五，干得好还有提成。',
    '后来你才知道，那份合同上盖的是假章。',
    { t: '这件事你当时不知道。当时你只知道，你已经花了七千多块钱，退不回去了。', cls: 'inner' }
  ],
  choices: [
    { label: '要看一眼合同，把条款记住。',
      to: 'p_load',
      effect: { standing: +3, body: -2, flags: { read_contract: true } } },
    { label: '不看。签完就走。',
      to: 'p_load',
      effect: { body: +2, flags: { trusted_company: true } } }
  ]
},

p_load: {
  id: 'p_load', act: A, day: 4, date: '2010 年 12 月', place: '鲁荣渔 7451 · 甲板',
  mood: 'calm', ambience: 'engine',
  text: [
    '接下来几天一直在往船上搬东西。鱼肉米面、蔬菜，公司给。装灯，接线，试机器。',
    '你自己花钱买了不少：方便面、矿泉水、饮料、啤酒，啤酒一人带五六捆。烟你带了三十条——要抽两年，中途在货轮上补，一条能贵百八十块。',
    '然后你看见了贺松的东西。',
    '一百六十五条烟。从铺板一直垒到舱顶，人得侧着身子才能过去。',
    { t: '「这他妈上了船还不知道咋回事，烟我不能亏了自己。」', cls: 'q' },
    '烟是赊的。船上有话传开：他一个月的工钱，够呛能还上这笔账。'
  ],
  choices: [
    { label: '帮贺松把烟搬上去，搭把手。',
      to: 'p_sail',
      effect: { standing: +6, body: -5, flags: { helped_he: true } } },
    { label: '管好自己那点东西，多检查两遍。',
      to: 'p_sail',
      effect: { body: +2, flags: { prepared: true } } },
    { label: '跟老周要几个塑料袋，把怕潮的东西包上。',
      to: 'p_sail',
      effect: { standing: +3, flags: { knows_cook: true } } }
  ]
},

/* ─────────────────────────────────────────────────────────────
   出海
   ───────────────────────────────────────────────────────────── */

p_sail: {
  id: 'p_sail', act: A, day: 5, date: '2010 年 12 月 27 日', place: '石岛 · 出境',
  mood: 'tense', ambience: 'engine',
  text: [
    '出海那天，公司一次出去七条船，有几条是"黑着"去的。',
    '海关挨个核对出境记录。船开出不远，边检的人就下船走了。开出去十分钟，船停下，公司另派一条船把十几个人送了上来——那些人都没有海员证。',
    '贺松就在这批人里。他的烟早就搬上来了。',
    '你没有海员证这件事，你也是那天才知道的。有证的人都在这一条船上，没证的从另一条船过驳上来。你不知道自己算哪一批。',
    '船头朝东南。岸很快就剩一条线，然后那条线也断了。',
    { t: '"刚开始感觉挺好的，一望无际，心里瞅着挺敞亮。"——后来你是这么跟人说的。', cls: 'inner' }
  ],
  choices: [
    { label: '找船长问清楚：我到底有没有证？',
      to: 'p_seasick',
      effect: { standing: +5, flags: { asked_papers: true } } },
    { label: '不问了。船已经开了。',
      to: 'p_seasick',
      effect: { body: +2, flags: { swallowed_it: true } } }
  ]
},

p_seasick: {
  id: 'p_seasick', act: A, day: 8, date: '航程第 4 天', place: '太平洋 · 航渡中',
  mood: 'calm', ambience: 'sea',
  text: [
    '你开始吐。',
    '一天吐好几回，吃什么吐什么，闻见机油味就吐。舱里那股味道散不掉——铁的、油的、人身上的、还有别人的呕吐物。你躺在铺上，天花板上那盏灯跟着船一起晃，晃得你眼睛疼。',
    '大勇比你强点，他还能打牌。',
    '第十六天，你不吐了。',
    '然后你发现，不吐之后，日子并没有变好——只是变成了另一种难。看不见陆地的那种难。',
    { t: '往前看是水，往后看是水，往左往右都是水。', cls: 'beat' }
  ],
  choices: [
    { label: '到甲板上待着。晕船也得站着。',
      to: 'p_firstfish',
      effect: { body: -6, standing: +3 } },
    { label: '躺着，能不动就不动。',
      to: 'p_firstfish',
      effect: { body: -3, standing: -2 } }
  ]
},

p_firstfish: {
  id: 'p_firstfish', act: A, day: 45, date: '2011 年 2 月末', place: '秘鲁海域',
  mood: 'calm', ambience: 'engine',
  text: [
    '四十来天之后，到了地方。',
    '天黑开灯。十几盏两千瓦的大灯一起打开，海面亮得像一块烧红的铁板，鱿鱼冲着光游过来，密密麻麻一层。',
    '下钩，往上薅。没什么技术含量，看看就会。',
    '就是沉。刚开始一个人拽十多斤都拽不动，得两个人一起。手上先是起泡，然后泡破了结成茧，茧再磨破。',
    '灯看久了眼睛流眼泪，流到后来就习惯了，早上回舱里，闭着眼还能看见那一片白。',
    '你的账一直在算：一斤鱿鱼两毛五。'
  ],
  choices: [
    { label: '跟贺松学：打听他下多深的水层。',
      to: 'p_unload',
      effect: { standing: +5, body: -3, flags: { learned_from_he: true } } },
    { label: '自己琢磨。不欠人情。',
      to: 'p_unload',
      effect: { body: -5, flags: { self_reliant: true } } },
    { label: '多干活，少说话，把数攒住。',
      to: 'p_unload',
      effect: { standing: +3, body: -4 } }
  ]
},

p_unload: {
  id: 'p_unload', act: A, day: 96, date: '2011 年 4 月', place: '秘鲁海域 · 收购船边',
  mood: 'tense', ambience: 'engine',
  text: [
    '舱满了就要到收购船卸货。',
    '下到舱底，一个人分五十盘，一盘三十斤，往上举。舱底没有风，四十度，人像泡在自己的汗里。',
    '你说你个子矮，举得吃力。赶上卸货，两天一夜不能睡。',
    '有一回你举到一半，胳膊突然没劲了，整盘鱼从手上滑下去，砸在下面人身上。那人骂了一句，你连回嘴的力气都没有。',
    '贺松那时候帮过你。他不让你下舱，替你举。他一共帮你举过两次。',
    { t: '你后来一直在想，那两次是真的还是假的。', cls: 'inner' }
  ],
  choices: [
    { label: '记这个情。以后还他。',
      to: 'p_rumor',
      effect: { standing: +4, flags: { owes_he: true } } },
    { label: '不记。船上谁也不欠谁。',
      to: 'p_rumor',
      effect: { body: -2, flags: { cold_blooded: true } } },
    { label: '找船长要求轮班。这么干要出人命。',
      to: 'p_rumor',
      effect: { standing: -6, body: -5, flags: { spoke_up_early: true } } }
  ]
},

/* ─────────────────────────────────────────────────────────────
   风声
   ───────────────────────────────────────────────────────────── */

p_rumor: {
  id: 'p_rumor', act: A, day: 140, date: '2011 年 5 月', place: '鲁荣渔 7451 · 船员舱',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '风声是从谁那儿先出来的，没人说得清。',
    '传的是工资：合同上写的保底四万五，其实不是保底——是按一斤鱿鱼两毛五算，钓够了，才拿得到那个数。合同跟当初说的不一样。',
    '还有人说，合同上那个章是假的。',
    '船员私下传，没人去问船长。',
    '你也听见了。你的第一反应是：这么大的公司，还能差这几个人的钱？'
  ],
  choices: [
    { label: '自己算。算清楚再说。',
      to: 'p_account',
      effect: { flags: { did_math: true }, body: -3 } },
    { label: '不信。传话的人自己都没底。',
      to: 'p_account',
      effect: { flags: { doubted_rumor: true }, standing: -3 } },
    { label: '去找贺松，问他怎么看。',
      to: 'p_account',
      effect: { standing: +5, flags: { asked_he: true } } }
  ]
},

p_account: {
  id: 'p_account', act: A, day: 140, date: '2011 年 5 月', place: '鲁荣渔 7451 · 铺位',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '你趴在铺上，拿手机的计算器一笔一笔加。',
    '钓了几个月。你钓的总比别人少——位置差不多，也问过下多深的水层，你的钩有时候修修整整，贺松那条钩歪了他都不弄，可他就是钓得多。',
    '有一个月他钓了一万三千多斤。',
    '你把你的斤数乘两毛五。',
    '然后你减去上船前花的七千多，减掉中途补的烟钱。',
    { t: '你算出来的数，比你买烟花的钱多不了多少。', cls: 'beat' },
    '你又算了一遍。',
    '贺松算得比你早。他心算一行数字，抬头就跟你说：「照这个算法，我这一趟白干，还得倒欠。」'
  ],
  choices: [
    { label: '那就不干了。回去打官司。',
      to: 'p_captain',
      effect: { standing: +4, flags: { thought_lawsuit: true } } },
    { label: '问贺松：你认识律师吗？',
      to: 'p_captain',
      effect: { standing: +6, flags: { thought_lawsuit: true, he_lawyer: true } } },
    { label: '把钱的事咽下去。先回去再说。',
      to: 'p_captain',
      effect: { body: +2, flags: { swallowed_it: true } } }
  ]
},

p_captain: {
  id: 'p_captain', act: A, day: 145, date: '2011 年 5 月', place: '鲁荣渔 7451 · 船长室外',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '贺松真的去找了船长。他跟船长说，想提前回国，回去跟公司打官司。',
    '船长在船长室里回了他一句。这句话后来整条船都知道了。',
    { t: '「你们回不去了。都没办船员证，其他船不敢搭你们回去，搭了就是偷渡。」', cls: 'q' },
    { t: '「你们干也得干，不干也得干。」', cls: 'q' },
    '你站在门外，听得很清楚。',
    '你没证。合同上的章是假的。你在离中国一万多海里的地方，在一艘不属于你、也不放你走的船上。',
    { t: '走诉讼这条路，后来证实也确实走不通——合同上的章是假的，他们其实是一群困在海上的黑工。', cls: 'inner' },
    '那天晚上，贺松在甲板上站了很久。他面前那片海，黑得没有边。'
  ],
  choices: [
    { label: '走过去，站在他旁边。什么都不说。',
      to: 'p_punch',
      effect: { standing: +8, flags: { stood_with_he: true } } },
    { label: '回舱里。这不是你的事。',
      to: 'p_punch',
      effect: { standing: -3, flags: { stayed_out: true } } },
    { label: '去劝他：别想不开。忍到回去。',
      to: 'p_punch',
      effect: { standing: +2, flags: { tried_to_calm: true } } }
  ]
},

p_punch: {
  id: 'p_punch', act: A, day: 155, date: '2011 年 6 月初', place: '鲁荣渔 7451 · 甲板',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '船长的脾气越来越坏。',
    '那天分鱼，有人磨蹭，船长过去一拳，那人眼圈当场就黑了。旁边没人敢吭声。',
    '过了几天，出了一件事，你记得很清楚。',
    '晚上老周喝了点酒，骂曲志刚——骂得很难听。曲志刚也喝了，回了两句，然后回舱拿了把刀，上去就扎老周。没扎着。大家下去把两个人拉开。',
    '船长给了曲志刚几撇子，说要撵他走。',
    '曲志刚当场就跪下了。',
    { t: '「我错了，我喝多了。」', cls: 'q' },
    '贺松也在旁边，帮着求了情。船长最后没撵他。',
    { t: '从那天起，曲志刚看老周的眼神就不一样了。', cls: 'inner' }
  ],
  choices: [
    { label: '私下提醒老周：你当心点曲志刚。',
      to: 'p_ask',
      effect: { standing: +3, flags: { warned_cook: true } } },
    { label: '记住曲志刚跪下的样子。这个人现在什么都干得出来。',
      to: 'p_ask',
      effect: { standing: +2, flags: { saw_kneel: true } } },
    { label: '不参与。船上这种事天天有。',
      to: 'p_ask',
      effect: { body: +2, standing: -2 } }
  ]
},

/* ─────────────────────────────────────────────────────────────
   核心抉择一：劫船
   ───────────────────────────────────────────────────────────── */

p_ask: {
  id: 'p_ask', act: A, day: 172, date: '2011 年 6 月 16 日 · 夜', place: '鲁荣渔 7451 · 前甲板',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '那天晚上你下钩没多久，鱿鱼就咬了。',
    '你想起自己有一把新鱼刀，刚磨过，溜尖溜尖的，放在前甲板。你回去取。',
    '取完回来，看见一个人趴在船舱口，跟你说话。是贺松。',
    { t: '「你刀挺好。借我看看，使使一会儿再给你。」', cls: 'q' },
    '你把刀给了他。他接过去，掂了掂，然后才跟你说下一句：',
    { t: '「一会儿劫船。你参不参加？」', cls: 'q' },
    '你脑子里第一个念头不是怕。是想：他为什么要先借刀再说这句话。',
    '他又说：「劫完船之后，肯定有不听话的，把救生筏打开，把他们撂里面，联系别的船来接。咱们开船回家。」',
    '他说"回家"两个字的时候，语气很平。',
    { t: '他串了半个月。他从来没找过你。今天他找你，是因为他需要一把刀，还是因为他需要一个人——你想不清楚。', cls: 'inner' }
  ],
  choices: [
    { label: '「我参加。」',
      to: 'p_raid',
      effect: { standing: +12, body: -5, flags: { joined_mutiny: true } },
      tone: 'risk' },
    { label: '「我不参加。我胆儿不行，干不了这个。」',
      to: 'p_raid',
      effect: { standing: -10, flags: { refused_mutiny: true } } },
    { label: '「你把刀还我。」——把刀要回来，不表态。',
      to: 'p_raid',
      effect: { standing: -4, flags: { stalled: true } },
      tone: 'risk' },
    { label: '「我站你这边。但今晚我不上船长室。」——出人，不出手。',
      to: 'p_raid',
      effect: { standing: +6, body: -3, flags: { joined_mutiny: true, kept_hands_back: true } } }
  ]
},

p_raid: {
  id: 'p_raid', act: A, day: 172, date: '2011 年 6 月 16 日 · 深夜', place: '鲁荣渔 7451 · 甲板',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '贺松拿着你的刀走了。',
    '回到钓鱼的位置，你不敢动。你也不知道该去告诉谁——你不知道谁跟他是一伙的。那会儿你看谁，谁都像跟他一伙的。',
    '你知道大副、二副肯定不是，大管轮肯定不是，他们都是船长的人。可他们离你太远，你往那边走，太明显。',
    '你身边全是普通船员。他们都在那儿装样子，鱼刀都收到了手边。',
    '过了一会儿，周满出来了。他前几天因为低血糖晕倒过，好几天没干活。你看见他把鞋都穿齐了。你问他干什么，他没理你，直接上了船长室。',
    '再过一会儿，贺松他们几个也上去了。',
    '船上的大灯很亮，晃得人眼睛疼。船长室里什么都看不见。',
    '没多久，贺松在里面喊：起锚，收钩。',
    '大家都起了。因为没人知道这是船长的命令还是别人的命令。',
    '舷梯——就是往二层甲板爬的那个梯子——两边各站着一个人，一人一把刀。',
    { t: '那一刻全船都知道出事了。', cls: 'beat' },
    '大副、二副、大管轮上去了，手上什么都没拿。他们上去劝：「想回家咱也不用这样，说一声咱回去就完事儿了。」',
    '然后二副把船启动了。锚在往上收。'
  ],
  choices: [
    { label: '上二层甲板，站在看得见的地方。',
      to: 'p_cook',
      effect: { standing: +5, body: -4, flags: { went_upstairs: true } },
      tone: 'risk' },
    { label: '留在大甲板上，守着你的钓位。',
      to: 'p_cook',
      effect: { body: +2, flags: { stayed_deck: true } } },
    { label: '回舱里，装睡。',
      to: 'p_cook',
      effect: { standing: -6, flags: { hid: true } } }
  ]
},

p_cook: {
  id: 'p_cook', act: A, day: 172, date: '2011 年 6 月 16 日 · 23 时', place: '鲁荣渔 7451 · 船长室外',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '收锚那段时间，老周提着一把刀上去了。',
    { t: '「这帮小逼崽子还想劫船！」', cls: 'shout' },
    '他在喊。他在往船长室冲。',
    '你听见船长室里面在喊叫。贺松喊：',
    { t: '「放倒！放倒！」', cls: 'shout' },
    '几声之后，就没动静了。',
    '你不知道里面具体发生了什么。你是过了一年，在案件材料上才看到那几行的：',
    { t: '贺松先指使周满、王鹏破坏船上的通讯和定位，安排曲志刚等人把守舷梯，随后伙同巴雅尔、双喜等人持刀持棍闯入船长室，用刀捅、棍打控制船长，逼他返航。', cls: 'inner' },
    { t: '老周发觉情况有变，提刀上来解救。进船长室后，后背中了此前已与他结仇的曲志刚两刀。他反身抓住刀刃，争夺中被铁棍打断左腿，跪倒在地。曲志刚一刀捅进胸腔，又在脖颈上抹了两刀。贺松补刀。', cls: 'inner' },
    '然后他们把老周扔进了海里。'
  ],
  choices: [
    { label: '冲上去，把曲志刚拉开。',
      to: 'p_body',
      effect: { standing: -14, body: -10, flags: { tried_to_stop_kill: true } },
      tone: 'blood' },
    { label: '把身上的刀递进去。',
      to: 'p_body',
      effect: { standing: +8, body: -3, flags: { handed_knife: true } },
      tone: 'blood' },
    { label: '转身，走到船头去。不去看。',
      to: 'p_body',
      effect: { standing: -2, flags: { looked_away: true } } },
    { label: '站在原地。你答应了参加，就得站在这儿。',
      to: 'p_body',
      effect: { standing: +4, body: -5, flags: { stood_watch: true } } }
  ]
},

p_body: {
  id: 'p_body', act: A, day: 172, date: '2011 年 6 月 17 日 · 凌晨', place: '鲁荣渔 7451 · 甲板',
  mood: 'blood', ambience: 'sea',
  text: [
    '过了一会儿，周满从舷梯上下来，从右边过来。',
    { t: '「有烟没？」', cls: 'q' },
    '你递给他。递烟的时候你发现，他的手一直在抖。',
    { t: '「老周死了。」', cls: 'q' },
    '他说完这句就走了。你怎么看着他走的，你后来一点都想不起来。',
    '又过了一会儿，曲志刚站在二层甲板上喊你。他比你大十岁，平时管你叫小赵。',
    { t: '「你上来一趟。」', cls: 'q' },
    '你磨磨蹭蹭往上走。他告诉你：「你上屋睡觉去吧，没有事儿。那谁没了，明天早上你开始做饭。」',
    '你说好。',
    '你上去的时候，拖鞋在二层甲板上放着。你一看，上面全是血。',
    '你没穿。光着脚进去了。脱了雨衣水裤，躺下，想着以后怎么办。',
    '睡不着。'
  ],
  choices: [
    { label: '起来，去厨房把明天的饭做好。',
      to: 'p_clean',
      effect: { standing: +6, body: -8, flags: { did_the_work: true } } },
    { label: '躺着。一直躺到天亮。',
      to: 'p_clean',
      effect: { body: +3, standing: -3 } },
    { label: '起来，把那把刀找回来——那是你的刀。',
      to: 'p_clean',
      effect: { standing: -2, body: -4, flags: { reclaimed_knife: true } } }
  ]
},

p_clean: {
  id: 'p_clean', act: A, day: 173, date: '2011 年 6 月 17 日', place: '鲁荣渔 7451 · 盥洗池',
  mood: 'blood', ambience: 'sea',
  text: [
    '天亮了。',
    '你在盥洗池边洗手。洗了很久。',
    '水是凉的。船还在走。',
    '你看着自己的手。',
    { t: '手上没有血。', cls: 'beat' },
    '你没有杀老周。你甚至没有递刀。你只是站在那儿，或者走开了，或者喊了一声——看你昨晚站的位置，你自己也记不清了。',
    '但你记得那声「放倒」。',
    '十二人间的人陆陆续续都回来了。没什么太大反应。都挺沉默，脱衣服，躺下。',
    '老韩坐在铺上脱鞋，一边脱一边说：',
    { t: '「没一个人就没一个人。回去就说刮海里了，给鱼带下去了。海上常有的事，这玩意儿回去很好解释。」', cls: 'q' },
    '你看了贺松一眼。他也在收拾鞋袜。',
    { t: '他没说同意，也没说不同意。从那会儿开始，你觉得他好像变成了另外一个人。', cls: 'inner' }
  ],
  choices: [
    { label: '跟着点头。「就说刮海里了。」',
      to: 'p_sailhome',
      effect: { standing: +9, flags: { agreed_cover: true } } },
    { label: '什么都不说。',
      to: 'p_sailhome',
      effect: { standing: -2, flags: { silent_cover: true } } },
    { label: '「他家里还有人。」',
      to: 'p_sailhome',
      effect: { standing: -9, body: -3, flags: { named_the_dead: true } },
      tone: 'risk' }
  ]
},

p_sailhome: {
  id: 'p_sailhome', act: A, day: 175, date: '2011 年 6 月 18 日', place: '鲁荣渔 7451 · 驾驶室',
  mood: 'tense', ambience: 'engine',
  text: [
    '船长被逼着用卫星导航设了返航路线。王鹏掌舵。船掉头往东，打算绕到夏威夷那边，再一路往西。顺利的话，五十天左右能到中国。',
    '劫船的时候，通讯设备就被拆了。',
    '第二天，鱼刀全被收走。救生筏用钢筋绑死。',
    '四个人一班，每天拿着刀轮班走岗，看着船长、大副、二副，不让他们乱动。',
    '贺松那一伙有九个人，主要是他和巴雅尔管事。',
    { t: '你算哪一伙？', cls: 'beat' },
    '周满拿着个笔记本，贺松一说话他就记。他只有十九岁，牙克石人，很高很瘦，看起来还是个孩子。他上船之前学会抽烟，贺松把自己的烟给他，从来没提过钱。',
    '刚往回走那十几天，船上气氛其实挺松。大家都想着要回家了。一说起老周，都说：',
    { t: '「那家伙装逼。」', cls: 'q' },
    '你也跟着笑过。',
    { t: '笑完的那天晚上，你躺在铺上想了很久，没想明白自己为什么笑得出来。', cls: 'inner' }
  ],
  choices: [
    { label: '主动要求排班走岗。这是站队。',
      to: 'n_act1',
      effect: { standing: +10, body: -8, flags: { took_watch: true } } },
    { label: '去厨房干活。做饭不用站队。',
      to: 'n_act1',
      effect: { body: -4, standing: +2, flags: { became_cook: true } } },
    { label: '找大勇商量：咱俩要不要加入他们。',
      to: 'n_act1',
      effect: { standing: +4, flags: { consulted_dayong: true } } },
    { label: '什么也不做。你不属于任何一伙。',
      to: 'n_act1',
      effect: { standing: -8, body: +4, flags: { unaligned: true } } }
  ]
}

  });
})();
