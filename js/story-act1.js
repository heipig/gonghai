/* ═══════════════════════════════════════════════════════════════
   《公海》第一幕  上岸的人 → 海上黑工 → 劫船之夜
   ─────────────────────────────────────────────────────────────
   素材来源（真实）：
     · 知乎专栏《鲁荣渔2682号杀人案 亲历：我们11人杀了22名同伴》(上)(下)
       ——原稿为杜强《太平洋大逃杀亲历者自述》，《时尚先生》2016
     · 新京报剥洋葱《生死船：鲁荣渔 2682 号》庭审旁听记录，2016
     · 《民主与法制时报》邓益辉报道 / 《文摘报》转载的起诉书时间线
     · 威海市中级人民法院起诉书 / 一审判决，2013

   主角设定（虚构）：
     轮机工程专业——高三分数不够，被调剂进去的。小镇出身，家里没人上过船。
     实习那半年在机舱里待了六个月，也吐了六个月。回来考三管轮，差一门没过。
     等他真想上船的时候，航运不景气，公司只认关系。
     这条鱿钓船是他能上的、唯一一条还要他的船。
     —— 学轮机这一条很重要：它让他站在机舱里，而机舱里有一根管子，
        那根管子是后面某个结局的钥匙。

   写作原则：
     · 一个节点五到九行，一行一句话。有对白，有细节，有他心里那点事。
     · 数字尽量用真的：一年四万五、165 条烟、两千瓦、三十斤一盘、13000 斤。
     · 引号里的是报道里的原话，一律照抄；没引号的是补写的过渡。

   配图：img 已生成 / imgSlot 待补（清单见 tools/image-slots.md）
   ═══════════════════════════════════════════════════════════════ */

(function () {
  var E = window.GH.Engine;

  E.register({

/* ═══════════════════ 序 · 上岸的人 ═══════════════════ */

p_open: {
  id: 'p_open', act: '序', place: '辽南 · 县城', date: '2010 年 10 月',
  mood: 'calm', ambience: 'wind', day: 1,
  img: 'img/quiet-town.jpg',
  text: [
    '你学的是轮机工程。高三那年分数不够，被调剂进去的。',
    '报到那天你才知道，这个专业是往机舱里钻的。',
    '家里没人上过船，也没人告诉过你这个专业能干什么。',
    '实习那半年，你在一条散货船的机舱里待了六个月，也吐了六个月。',
    '回来考三管轮，差一门没过，证就没下来。',
    { t: '今年航运不景气。你去问过两家公司，人家先问的是「谁介绍的」。', cls: 'inner' },
    '现在你在镇上摆烧烤摊，路边摊。那年夏天一直下雨，不赚什么钱。'
  ],
  choices: [
    { label: '把烧烤摊收了。等崔勇的电话。', to: 'p_call',
      effect: { flags: { gave_up_grill: true }, body: -2 } },
    { label: '白天继续摆摊，晚上等消息。', to: 'p_call',
      effect: { body: +2, standing: -1 } },
    { label: '给学校老师打个电话，问有没有船上缺人。', to: 'p_call',
      effect: { flags: { asked_school: true }, body: -4, standing: +3 } }
  ]
},

p_call: {
  id: 'p_call', act: '序', place: '县城 · 路边', date: '2010 年 10 月',
  mood: 'calm', ambience: 'quiet', day: 3,
  text: [
    '崔勇打电话来。他是大连本地人，以前跟你在一个饭店干过。',
    '他说有个活：出海钓鱿鱼，一年四万五，完了还有提成。',
    { t: '「就这钱，在陆地上你得攒几年。」', cls: 'q' },
    '你处了个对象。她家里问你能拿出什么，你答不上来。',
    '你想的是挣点钱回来，最起码有点资本。',
    '你问他，两年？他说合同上写的是一年，一般干两年。'
  ],
  choices: [
    { label: '「四万五，我去。」', to: 'p_family',
      effect: { flags: { for_money: true }, rel: { cui: +1 } } },
    { label: '「我得问问我妈。」', to: 'p_family',
      effect: { flags: { for_shame: true }, rel: { cui: +1 }, body: -2 } },
    { label: '「我想离开这儿。去哪儿都行。」', to: 'p_family',
      effect: { flags: { running_away: true }, body: -3 } }
  ]
},

p_family: {
  id: 'p_family', act: '序', place: '家里', date: '2010 年 10 月',
  mood: 'calm', ambience: 'quiet', day: 5,
  text: [
    '你妈不同意。她说太远了，说她晚上睡不着。',
    '朋友也劝你，说那玩意儿不是人干的活。',
    '可你已经跟家里说完了。现在不去，像是你遭不了那个罪。',
    { t: '你二十五六了。办点啥事老是中途而废，自己也交代不过去。', cls: 'inner' },
    '而且海员证和上物资的钱，前期已经花了七千多。'
  ],
  choices: [
    { label: '「我挣两年钱就回来。」', to: 'p_sign',
      effect: { flags: { promised_mother: true }, standing: +3, body: -2 } },
    { label: '什么都不说，把钱交了。', to: 'p_sign',
      effect: { body: -4, flags: { silent_leave: true } } },
    { label: '跟你妈说清楚这船到底是什么船。', to: 'p_sign',
      effect: { flags: { warned_family: true }, body: -3, standing: +2 } }
  ]
},

p_sign: {
  id: 'p_sign', act: '序', place: '大连 → 山东', date: '2010 年 10 月',
  mood: 'calm', ambience: 'engine', day: 8,
  text: [
    '海员证一共上了三天课。考试也是连抄带蒙，基本就给证了。',
    '10 月 5 号从大连去的山东。公司掏一部分钱。',
    '到了公司才知道，你们那条船还在海上没回来，得在岸上等。',
    '合同你粗粗看了一遍。保底四万五，你签了字。',
    { t: '你没细看后面那几页。后来那几页要了命。', cls: 'inner' }
  ],
  choices: [
    { label: '把合同折起来，收进包里。', to: 'p_wait',
      effect: { flags: { kept_contract: true }, standing: +2 } },
    { label: '问崔勇：「这合同靠谱吗？」', to: 'p_wait',
      effect: { rel: { cui: +2 }, flags: { asked_contract: true } } },
    { label: '拿手机把合同每一页都拍下来。', to: 'p_wait',
      effect: { flags: { photographed_contract: true }, body: -2, standing: +3 } }
  ]
},

p_wait: {
  id: 'p_wait', act: '序', place: '荣成 · 石岛', date: '2010 年 11 月',
  mood: 'calm', ambience: 'wind', day: 20,
  imgSlot: '石岛码头，几十条渔船挤在雾里，岸边蹲着等活的船员。开篇定调可用。',
  text: [
    '船员一共找了 33 个。最开始报了 35 个，有几个家里出事走了。',
    '有一个的妈被车刮倒，胳膊摔断了，家里没人照顾，他就不干了。',
    '留下来的开船前你都见着了，平时也一块吃饭。',
    { t: '没觉着他们怎么。跟你一样，都是出来打工的。', cls: 'inner' },
    '有个叫项立山的，头发全白了，五十多岁。',
    '他说他以前弄死过人，打过两回劳改。',
    { t: '后来才知道，他两次犯罪记录都是盗窃。', cls: 'inner' }
  ],
  choices: [
    { label: '跟项立山多聊两句。', to: 'p_duty',
      effect: { body: -2, flags: { talked_xiang: true }, standing: +2 } },
    { label: '去找管事的，问自己上船干什么活。', to: 'p_duty',
      effect: { flags: { asked_duty: true }, standing: +4, body: -3 } },
    { label: '一个人蹲在码头边，看那些船。', to: 'p_duty',
      effect: { body: -1, flags: { watched_ships: true } } }
  ]
},

p_duty: {
  id: 'p_duty', act: '序', place: '公司办公室', date: '2010 年 11 月',
  mood: 'calm', ambience: 'quiet', day: 22,
  text: [
    '开船前公司把活儿分了。管事的翻了一下你的材料，看到「轮机工程」，抬了下头。',
    { t: '「学轮机的？那正好，机舱缺人。」', cls: 'q' },
    '他说轮机长叫温斗，大管轮叫王延龙，你跟着他们。',
    { t: '你想问一句工钱怎么算，他把材料合上了。', cls: 'inner' }
  ],
  choices: [
    { label: '既然是本行，那就好好干。', to: 'p_yan',
      effect: { flags: { assigned_engine: true }, standing: +4 } },
    { label: '「我不下机舱。我晕船。」', to: 'p_yan',
      effect: { flags: { refused_engine: true }, standing: -5, body: -3 } },
    { label: '「机舱的活，钱跟甲板上一样吗？」', to: 'p_yan',
      effect: { flags: { assigned_engine: true, asked_pay: true },
                standing: -3, rel: { cui: +1 } } }
  ]
},

/* ═══════════════════ 接船第一天 ═══════════════════ */

p_yan: {
  id: 'p_yan', act: '序', place: '石岛蚧口码头', date: '2010 年 11 月',
  mood: 'tense', ambience: 'wind', day: 24,
  img: 'img/night-jump.jpg',
  text: [
    '接船的第一天，就出了点挺诡异的事。',
    '那会儿还是 11 月。船上原来那个大师傅姓严，也是大连的，大副找的人。',
    '以前在别的船上都还好好的。',
    '那天晚上他们在船上打扑克，你在边上看手机。八点多钟，严师傅开始在那儿喊。',
    { t: '「杀人了、杀人了。」', cls: 'shout' },
    '他在哪个屋都喊，连着喊到十点、十二点多。他那屋好几个人都吓着了。',
    '快一点的时候，船长把他叫上去骂了一顿。骂完他老实了，在那儿坐着。'
  ],
  choices: [
    { label: '过去看看他到底怎么了。', to: 'p_yan2',
      effect: { body: -3, standing: +3, flags: { saw_yan_close: true } } },
    { label: '回自己铺上躺着。这不关你的事。', to: 'p_yan2',
      effect: { body: +2, standing: -4 } },
    { label: '去跟大副说一声，这人不太对劲。', to: 'p_yan2',
      effect: { standing: +2, flags: { reported_yan: true }, body: -5 } }
  ]
},

p_yan2: {
  id: 'p_yan2', act: '序', place: '石岛蚧口码头', date: '2010 年 11 月 25 日 凌晨',
  mood: 'tense', ambience: 'wind', day: 24,
  text: [
    '快一点的时候，他自己出去了。你们都以为他去上厕所。',
    '他直接跳海里去了。',
    '那天正好降温，刮大北风，五六级。他往港口中间游。',
    '船开出去找，找了得有半个多小时。天黑得看不见人。',
    '中间正好有艘站锚的船发现了他，把他救了上去。',
    '大副当天就把他送回家了。他家人说他脑袋受过刺激——他妈死的时候。',
    { t: '回去待了几天他就好了，还想上船。最后没用他。', cls: 'beat' },
    '换上来一个新的大师傅，姓夏。'
  ],
  choices: [
    { label: '「老夏是个什么人？」', to: 'p_board',
      effect: { flags: { asked_about_xia: true }, body: -2 } },
    { label: '那天晚上的风你记了很久。', to: 'p_board',
      effect: { flags: { remembered_wind: true }, body: -4 } },
    { label: '你只是觉得这条船有点邪。', to: 'p_board',
      effect: { body: -1 } }
  ]
},

/* ═══════════════════ 出海 ═══════════════════ */

p_board: {
  id: 'p_board', act: '序', place: '石岛外海', date: '2010 年 12 月 27 日',
  mood: 'calm', ambience: 'engine', day: 37,
  imgSlot: '鞭炮在船头炸开，灰白的烟，船正在离港。可以很响、很亮。',
  text: [
    '正式出海那天放了鞭炮。公司一次出去七条船。',
    '有几条是黑着去的。有船员证的，都在你们这条船上。',
    '海关过来挨个儿对出境记录。开出去不远，边检就走了。',
    '开十分钟，船停下来。公司再派另一条船，把没证的人送上来。',
    '十多个没证的，其中一个叫刘贵夺。'
  ],
  choices: [
    { label: '在舷边看着那条小船靠过来。', to: 'p_smoke',
      effect: { body: -2, flags: { saw_liu_board: true } } },
    { label: '回机舱去。船一开，机舱就有活。', to: 'p_smoke',
      effect: { standing: +3, body: -4 } }
  ]
},

p_smoke: {
  id: 'p_smoke', act: '第一幕', place: '十二人间', date: '2010 年 12 月',
  mood: 'calm', ambience: 'engine', day: 38,
  img: 'img/cigarettes.jpg',
  text: [
    '刘贵夺带了 165 条烟。垒得老高，从床铺一直垒到顶上。',
    { t: '「这他妈上了船还不知道咋回事，烟我不能亏了自己。」', cls: 'q' },
    '他一天晚上得三盒。这 165 条都是赊的。',
    '你自己带了 30 条，因为要抽两年。啤酒一人带五六捆。',
    '船上中途也能补，但贵，一条能贵百八十块。'
  ],
  choices: [
    { label: '跟他搭话。', to: 'n_sea',
      effect: { rel: { liu: +2 } } },
    { label: '问他这烟赊了多少钱。', to: 'n_sea',
      effect: { rel: { liu: +1 }, flags: { asked_smoke_debt: true } } },
    { label: '不说话。这人不好接近。', to: 'n_sea',
      effect: { rel: { liu: -1 }, body: +2 } }
  ]
},

/* ── 夜航 0：往秘鲁去的四十天 ── */
n_sea: {
  id: 'n_sea', act: '第一幕', place: '太平洋 · 去秘鲁途中', date: '2011 年 1 月',
  mood: 'calm', ambience: 'sea', day: 45,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act1', draws: 2, then: 'p_seasick' },
  text: [
    '刚开始感觉挺好。一看一望无际，心里瞅着挺敞亮。',
    '时间长了，看不着陆地，心里就没底了。',
    '你开始一直吐，一天吐好几回。',
    '到第十六天，晕船忽然就好了。'
  ]
},

p_seasick: {
  id: 'p_seasick', act: '第一幕', place: '十二人间', date: '2011 年 1 月',
  mood: 'calm', ambience: 'sea', day: 60,
  text: [
    '往秘鲁去的路上，大家关系还可以。反正都要去打鱼，都在一条船上。',
    '成天打牌，天南海北胡扯，说回来之后怎么样怎么样。',
    '有人说买个改装的车，有人说出去玩把钱全花了。',
    { t: '你不算太爱说的，比较适合当听众。', cls: 'inner' },
    '他们天天推牌九，你偶尔玩。赌得还不小。',
    '你身上那点现金，基本都让崔勇借去了，两三千。'
  ],
  choices: [
    { label: '「这钱你什么时候还。」', to: 'p_arrive',
      effect: { rel: { cui: -1 }, body: +2 } },
    { label: '算了。船上也没处花。', to: 'p_arrive',
      effect: { rel: { cui: +2 }, smokes: 1 } },
    { label: '不爱借，但也没好意思说。', to: 'p_arrive',
      effect: { body: -2, flags: { silent_lender: true } } }
  ]
},

/* ═══════════════════ 秘鲁海域 ═══════════════════ */

p_arrive: {
  id: 'p_arrive', act: '第一幕', place: '秘鲁海域', date: '2011 年 2 月 28 日',
  mood: 'calm', ambience: 'sea', day: 90,
  text: [
    '四十来天之后，2 月的最后一天，你们到地方了。',
    '晚上天黑开始钓。灯一打开，鱿鱼冲着光就游过来。',
    '把钩下下去，感觉有鱼往上薅就行了，没什么技术含量，看看就会。',
    '刚开始有鱼咬了你都不知道。一个人拽十多斤都拽不动，得两个人拽。'
  ],
  choices: [
    { label: '去问刘贵夺，钩该下多深。', to: 'p_lamps',
      effect: { rel: { liu: +2 }, body: -5 } },
    { label: '先跟着甲板上的人学。', to: 'p_lamps',
      effect: { standing: +2, body: -3 } },
    { label: '你更关心机舱。船一开就是你的活。', to: 'p_lamps',
      effect: { flags: { stayed_engine: true }, standing: +3, body: -6 },
      require: { flag: 'assigned_engine', why: '你被分在甲板上，机舱不归你。' } }
  ]
},

p_lamps: {
  id: 'p_lamps', act: '第一幕', place: '钓鱿甲板', date: '2011 年 3 月',
  mood: 'calm', ambience: 'sea', day: 95, img: 'img/lamps.jpg',
  text: [
    '船头有根杆，一边一个连接，上面挂灯。',
    '一个两千瓦，飞利浦的，有这么粗。挂了十几个。',
    '人眼睛看时间长了受不了，都流眼泪。',
    { t: '灯都能把人烤黑。', cls: 'q' },
    '大鱿鱼有近两百斤。一个人拽不动。'
  ],
  choices: [
    { label: '死死盯着水面。', to: 'p_fishing',
      effect: { body: -9, standing: +3 } },
    { label: '低头避光，慢慢来。', to: 'p_fishing',
      effect: { body: -4, standing: -2 } },
    { label: '把灯下最好的位置让给别人。', to: 'p_fishing',
      effect: { body: -3, standing: +1, rel: { zhao: +1 } } }
  ]
},

p_fishing: {
  id: 'p_fishing', act: '第一幕', place: '钓鱿甲板 · 机舱', date: '2011 年 3 月',
  mood: 'calm', ambience: 'engine', day: 105,
  text: [
    '几个月下来，你钓的总比别人少。',
    '刘贵夺钓得最多。有一个月，他钓了 13000 多斤。',
    '你们位置没差太多，你也向他学过，问过钩该下多深。',
    '你的钩有时候还修修整整。他的钩连弄都不弄，有时候歪了他也不管，就钓那么多。',
    '刘贵夺跟你、崔勇，还有黄金波，年龄比较接近，能聊到一块去。',
    { t: '但你感觉他心里挺傲，对你们也有点瞧不起。', cls: 'inner' }
  ],
  choices: [
    { label: '去机舱找温斗报到。', to: 'p_wendou',
      effect: { flags: { went_to_wendou: true }, standing: +5, body: -5 },
      require: { flag: 'assigned_engine', why: '你被分在甲板上，机舱不归你。' } },
    { label: '跟着大家钓鱼，机舱的活能推就推。', to: 'p_wendou',
      effect: { body: -3, standing: -3 } },
    { label: '两头都干。白天机舱，晚上甲板。', to: 'p_wendou',
      effect: { body: -14, standing: +8, flags: { worked_both: true } },
      require: { flag: 'assigned_engine', why: '你被分在甲板上，机舱不归你。' } }
  ]
},

p_wendou: {
  id: 'p_wendou', act: '第一幕', place: '机舱', date: '2011 年 4 月',
  mood: 'calm', ambience: 'engine', day: 120,
  imgSlot: '渔船机舱，锈管道、主机、仪表盘，一个人打着手电在查管路。',
  text: [
    '轮机长温斗管机器管得很好。他三十多岁，话不多。',
    '他有个叔伯兄弟叫温密，也在船上，住机舱那个四人间。',
    '大管轮王延龙比他年轻些，管管路和阀。',
    '温斗看你材料上写着轮机工程，问你一句：「考出证来了吗？」',
    { t: '你说差一门。他没再问，把手电递给你。', cls: 'inner' },
    { t: '「机舱就这些。你把这根管子记住，别的地方坏了都不要紧。」', cls: 'q' }
  ],
  choices: [
    { label: '跟着学。记管路，记阀，记仪表。', to: 'p_notebook',
      effect: { flags: { learned_pipes: true }, standing: +6, body: -8 } },
    { label: '问他那根管子是干什么用的。', to: 'p_notebook',
      effect: { flags: { knows_valve: true }, body: -4, standing: +4 } },
    { label: '敷衍两句。你不想在这条船上太显眼。', to: 'p_notebook',
      effect: { body: +3, standing: -4 } }
  ]
},

p_notebook: {
  id: 'p_notebook', act: '第一幕', place: '十二人间', date: '2011 年 5 月',
  mood: 'tense', ambience: 'quiet', day: 150,
  text: [
    '快回秘鲁港补水的时候，有一次你回寝室。',
    '刘贵夺那块放着个小笔记本。你没事翻了两页。',
    '上面记着一些数字。你问他，他说是航行坐标。',
    { t: '「你记这个干啥。」', cls: 'q' },
    { t: '「没事儿就闲着玩记的。」', cls: 'q' },
    { t: '具体他怎么想的你搞不明白。感觉他总在琢磨事儿，一般人看不透他。', cls: 'inner' }
  ],
  choices: [
    { label: '把这事记住，不跟别人说。', to: 'n_labor',
      effect: { flags: { saw_notebook: true }, body: -3 } },
    { label: '找机会跟温斗提一句。', to: 'n_labor',
      effect: { flags: { saw_notebook: true, told_wendou: true },
                standing: -4, rel: { liu: -2 }, body: -4 } },
    { label: '什么都不想。这不是你的事。', to: 'n_labor',
      effect: { body: -1 } }
  ]
},

/* ── 夜航 1：钓鱿的日日夜夜 ── */
n_labor: {
  id: 'n_labor', act: '第一幕', place: '秘鲁渔场', date: '2011 年 5 月',
  mood: 'calm', ambience: 'sea', day: 158,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act1', draws: 3, then: 'p_rumor' },
  text: [
    '钓上来的鱼要分：三十斤一盘，单个超过八斤得分开。',
    '头是头，翅是翅，身子是身子，称斤、分类、洗完装盘入冻板间。',
    '别的船早上八九点就收完了，你们得干到十点、十一点、十二点。',
    '一到这会儿就找不见人，都跑去偷懒了。船长天天喊，也没人听。'
  ]
},

p_rumor: {
  id: 'p_rumor', act: '第一幕', place: '十二人间', date: '2011 年 5 月',
  mood: 'tense', ambience: 'engine', day: 160,
  text: [
    '时间一久，不知道听谁说的，传出来了。',
    '说公司的工资有点不准，说回去要找事儿，要扣工资，合同也不对。',
    '一开始说保底四万五，其实是按一斤鱿鱼两毛五算，钓够了才有那么多。',
    '刘贵夺脑瓜快，一算账，发现最后挣的还不够他买烟的钱。',
    { t: '你不太信。那么大个公司，还能差这几个人的工资。', cls: 'inner' }
  ],
  choices: [
    { label: '自己也拿手机把账算了一遍。', to: 'p_captain',
      effect: { flags: { did_math: true }, body: -4 } },
    { label: '把合同翻出来，看那几页到底写了什么。', to: 'p_captain',
      effect: { flags: { read_contract: true }, body: -3, standing: +3 },
      require: { anyOf: ['kept_contract', 'photographed_contract'],
                 why: '合同你没留底，现在想看也没有了。' } },
    { label: '去问船长。', to: 'p_captain',
      effect: { standing: -4, flags: { asked_captain: true } } }
  ]
},

p_captain: {
  id: 'p_captain', act: '第一幕', place: '船长室门口', date: '2011 年 5 月',
  mood: 'tense', ambience: 'engine', day: 163,
  text: [
    '船长叫李承权。很高，个儿很大，脾气不好。',
    '有船员惹他不高兴，他一拳打过去，眼圈都黑了。',
    '船员之间起争执，他总向着自己的老乡，再就是打耳光。',
    '后来刘贵夺就提前回国的事找过他。',
    { t: '「你们回不去了，都没办船员证，其他船不敢搭你们回去，否则就是偷渡。」', cls: 'q' },
    { t: '「你们干也得干，不干也得干！」', cls: 'shout' }
  ],
  choices: [
    { label: '船长说得对。你确实回不去。', to: 'p_jiang',
      effect: { body: -5, flags: { knows_trapped: true } } },
    { label: '合同上盖的是假公章。你们是黑工。', to: 'p_jiang',
      effect: { flags: { knows_fake_seal: true }, standing: +4, body: -3 },
      require: { anyOf: ['read_contract', 'kept_contract', 'photographed_contract'],
                 why: '你没细看那份合同，说不出来。' } },
    { label: '偷渡也得回。这钱不能白干。', to: 'p_jiang',
      effect: { rel: { liu: +2 }, flags: { wants_home: true } } }
  ]
},

p_jiang: {
  id: 'p_jiang', act: '第一幕', place: '食堂', date: '2011 年 5 月',
  mood: 'tense', ambience: 'quiet', day: 166,
  imgSlot: '食堂里一个人跪在地上，另一个人站着。只拍背影和手，不拍脸。',
  text: [
    '新换上来的大师傅老夏，平时诈诈唬唬，爱拍船长马屁。',
    '他总以为自己年龄大，见过世面。',
    '出事以前有天晚上，他喝了点酒，骂姜晓龙。',
    '姜晓龙拿刀去扎他，没扎着。你们下去把两个人拉开。',
    '船长给了姜晓龙几巴掌，要撵他走。',
    '姜晓龙当场给船长跪下了，说自己错了，喝多了。',
    '刘贵夺也在那儿帮着求情。可能从那儿开始，两个人有点结仇。'
  ],
  choices: [
    { label: '上去替姜晓龙说句话。', to: 'p_ma',
      effect: { standing: -3, body: -4, flags: { spoke_for_jiang: true } } },
    { label: '看着。这跟你没关系。', to: 'p_ma',
      effect: { body: -2 } },
    { label: '把姜晓龙扶起来。', to: 'p_ma',
      effect: { standing: +3, body: -3, flags: { helped_jiang: true } } }
  ]
},

p_ma: {
  id: 'p_ma', act: '第一幕', place: '十二人间 · 下铺', date: '2011 年 5 月 18 日',
  mood: 'calm', ambience: 'sea', day: 169,
  img: 'img/diary.jpg',
  text: [
    '马玉超睡你下铺。他刚毕业没多久，是船上唯一一个大学生。',
    '他爱写日记。他说他从小就爱写东西。',
    '那天他刚给家里打完电话，坐在铺上没说话。',
    { t: '「轮船下面就是万丈深渊，毕竟在太平洋彼岸，谈何容易。」', cls: 'q' },
    '你看了他一眼。他跟你差不多岁数。'
  ],
  choices: [
    { label: '「还有一年半。熬得住。」', to: 'p_rule',
      effect: { rel: { ma: +3 }, flags: { comforted_ma: true } } },
    { label: '「你写的这些，别让刘贵夺看见。」', to: 'p_rule',
      effect: { rel: { ma: +2 }, flags: { warned_ma: true }, body: -2 } },
    { label: '你学轮机的，跟他讲讲机舱里的东西。', to: 'p_rule',
      effect: { rel: { ma: +2 }, body: -3, flags: { taught_ma: true } },
      require: { flag: 'assigned_engine', why: '你被分在甲板上，机舱你自己都没进去过。' } },
    { label: '不说话。你也不想说话。', to: 'p_rule',
      effect: { body: +2 } }
  ]
},

p_rule: {
  id: 'p_rule', act: '第一幕', place: '后甲板', date: '2011 年 6 月',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  text: [
    '有一天刘贵夺对你说：咱们干活累，公司很黑，违反最低工资标准。',
    '他说合同上说的钱肯定拿不到。他说他想回家，跟公司打官司。',
    '他说他认识济南比较好的律师。',
    { t: '「这咋回去？」你问他。', cls: 'q' },
    '他支支吾吾，再没说别的。走之前又说了一句：',
    { t: '「公海上杀人不犯法。」', cls: 'shout' }
  ],
  choices: [
    { label: '「你想干什么。」', to: 'n_plan',
      effect: { rel: { liu: +2 }, flags: { heard_sea_rule: true } } },
    { label: '「这话你别跟我说。」转身走。', to: 'n_plan',
      effect: { rel: { liu: -1 }, body: -2, flags: { heard_sea_rule: true } } },
    { label: '把这句话记住。', to: 'n_plan',
      effect: { flags: { heard_sea_rule: true }, standing: +2 } }
  ]
},

/* ── 夜航 2：串联的半个月 ── */
n_plan: {
  id: 'n_plan', act: '第一幕', place: '秘鲁渔场', date: '2011 年 6 月',
  mood: 'tense', ambience: 'sea', day: 171,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act1', draws: 2, then: 'p_knife' },
  text: [
    '刘贵夺秘密串联持续了半个月。',
    '他经常拉着其他人说话，神神秘秘的，心思也不在钓鱼上了。',
    '你每天仍旧按时把鱼钩沉到平静的海里。',
    '船快到智利了，要补燃油。'
  ]
},

p_knife: {
  id: 'p_knife', act: '第一幕', place: '前甲板', date: '2011 年 6 月 16 日',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  imgSlot: '前甲板上的一把新磨过的鱼刀特写，旁边是一只伸过来的手。只拍刀和手。',
  text: [
    '那天晚上，你下钩没多久，鱿鱼就咬了钩。',
    '钓起来之后，你想起有把新鱼刀，刚磨过，溜尖溜尖的，放在前甲板。',
    '取完回来，看见一个人趴在船舱口聊天。是刘贵夺。',
    '看你拿刀过来，他说：',
    { t: '「你刀挺好，你借我看看，借我使使，使使一会儿再给你。」', cls: 'q' },
    '你借了。借完之后他才跟你说：',
    { t: '「一会儿劫船，你参不参加？」', cls: 'shout' }
  ],
  choices: [
    { label: '「不参加。」', to: 'p_refuse',
      effect: { flags: { refused_hijack: true }, rel: { liu: -2 }, body: -5 } },
    { label: '「算我一个。」', to: 'p_join',
      effect: { flags: { joined_hijack: true }, rel: { liu: +3 },
                standing: +8, body: -5 }, tone: 'risk' },
    { label: '「我胆儿不行，干不了这个。」', to: 'p_refuse',
      effect: { flags: { refused_hijack: true }, rel: { liu: -1 } } },
    { label: '「我是学轮机的。你要劫船，机舱那边得有人。」', to: 'p_engine_deal',
      effect: { flags: { offered_engine: true }, rel: { liu: +1 },
                standing: +3 }, tone: 'risk',
      require: { flag: 'assigned_engine', why: '你不在机舱干活，这话说不出口。' } }
  ]
},

p_refuse: {
  id: 'p_refuse', act: '第一幕', place: '钓鱿甲板', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  text: [
    '他又说：劫完船之后，肯定有不听话的，把救生筏打开，把他们扔到里面。',
    '之后联系别的船过来接，咱们开船回家。',
    { t: '「看看吧，我胆儿不行，干不了这个。」你说。', cls: 'q' },
    '他说行，拿着你的鱼刀走了。',
    '回到钓鱼的位置，你也害怕。你知道一会儿肯定要劫船。',
    '可你不敢去告诉谁——你不知道谁跟他是一伙的。',
    { t: '那阵儿瞅谁谁像跟他一伙的。', cls: 'inner' }
  ],
  choices: [
    { label: '装作在钓鱼。', to: 'a2_hijack',
      effect: { body: -6, flags: { played_dumb: true } } },
    { label: '收好鱼钩，挪到前面大甲板上去。', to: 'a2_hijack',
      effect: { body: -3, standing: +2 } },
    { label: '下机舱去。那里至少只有你一个人。', to: 'a2_hijack',
      effect: { body: -4, flags: { hid_in_engine: true } } }
  ]
},

p_join: {
  id: 'p_join', act: '第一幕', place: '钓鱿甲板', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  text: [
    '同意劫船的有十四个人，全是普通船员。',
    '没有一个人是有职务的。',
    { t: '「我们只不过是想劫船回国和公司打官司。」', cls: 'q' },
    '你点头。你把这件事在心里换算成了一笔账：两年，四万五，加上提成。'
  ],
  choices: [
    { label: '跟着刘贵夺上舷梯。', to: 'a2_hijack',
      effect: { rel: { liu: +2 }, body: -8, flags: { went_up: true } } },
    { label: '留在甲板上守舷梯。', to: 'a2_hijack',
      effect: { body: -4, standing: +3, flags: { guarded_ladder: true } } },
    { label: '你说你去机舱，把主机稳住。', to: 'a2_hijack',
      effect: { body: -3, standing: +5, flags: { held_engine: true } },
      require: { flag: 'assigned_engine', why: '你不在机舱干活，这话说不出口。' } }
  ]
},

p_engine_deal: {
  id: 'p_engine_deal', act: '第一幕', place: '前甲板', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  text: [
    '刘贵夺看了你一会儿。他大概没想到你会讲条件。',
    { t: '「行。你下去看着机器，别让人进机舱。」', cls: 'q' },
    '你答应了，但没答应别的事。',
    { t: '你想的是：真出了事，机舱是这条船上唯一能一个人待着的地方。', cls: 'inner' }
  ],
  choices: [
    { label: '下机舱。把门从里面插上。', to: 'a2_hijack',
      effect: { flags: { sealed_engine: true, held_engine: true },
                standing: +6, body: -4 } },
    { label: '不下机舱，去舷梯那儿守着。', to: 'a2_hijack',
      effect: { standing: +4, body: -6, flags: { guarded_ladder: true } } }
  ]
}

  });
})();
