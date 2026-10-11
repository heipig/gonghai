/* ═══════════════════════════════════════════════════════════════
   《公海》第一幕  出海 → 海上黑工 → 劫船之夜
   ─────────────────────────────────────────────────────────────
   素材来源（真实）：
     · 杜强《太平洋大逃杀亲历者自述》，《时尚先生》2016
     · 新京报剥洋葱《生死船：鲁荣渔 2682 号》庭审实录，2016
     · 威海市中级人民法院起诉书 / 一审判决，2013

   写作原则：
     · 一个节点最多四行，一行一句话。宁可少写，不要写得看不下去。
     · 有原话的地方一律用原话，不转述、不润色。
     · 主角是虚构的天坑专业毕业生；其余人物、船名、公司全部真实。

   配图：
     · img      —— 已生成的图
     · imgSlot  —— 预留位；清单见 tools/image-slots.md
   ═══════════════════════════════════════════════════════════════ */

(function () {
  var E = window.GH.Engine;

  E.register({

/* ═══════════════════ 序 · 石岛码头 ═══════════════════ */

p_dock: {
  id: 'p_dock', act: '序', place: '石岛码头', date: '2010 年 11 月',
  mood: 'calm', ambience: 'wind', day: 1,
  imgSlot: '石岛码头清晨，雾里的旧渔船，岸边等活的人。开篇定调。',
  text: [
    '崔勇打电话来：出海钓鱿鱼，一年四万五。',
    { t: '你学的是生物工程。毕业两年，简历投了三百多份。', cls: 'inner' },
    '你在镇上摆烧烤摊。那年夏天一直下雨。'
  ],
  choices: [
    { label: '「四万五，我去。」', to: 'p_sign',
      effect: { flags: { for_money: true } } },
    { label: '「我不想再跟家里要钱了。」', to: 'p_sign',
      effect: { flags: { for_shame: true }, rel: { cui: +1 } } },
    { label: '「我想离开这儿。去哪儿都行。」', to: 'p_sign',
      effect: { flags: { running_away: true }, body: -3 } }
  ]
},

p_sign: {
  id: 'p_sign', act: '序', place: '鑫发水产公司', date: '2010 年 11 月',
  mood: 'calm', ambience: 'quiet', day: 6,
  text: [
    '海员证上了三天课。考试连抄带蒙，证就下来了。',
    '合同写着保底四万五。你没细看那一页。',
    '公司在石岛。船还没回来，你们在岸上等。'
  ],
  choices: [
    { label: '把合同那页折起来，收好。', to: 'p_yan',
      effect: { flags: { kept_contract: true } } },
    { label: '问崔勇：「这合同靠谱吗？」', to: 'p_yan',
      effect: { rel: { cui: +1 }, flags: { asked_contract: true } } },
    { label: '什么都不问。签了字。', to: 'p_yan',
      effect: { body: +2 } }
  ]
},

p_yan: {
  id: 'p_yan', act: '序', place: '石岛蚧口码头', date: '2010 年 11 月',
  mood: 'tense', ambience: 'wind', day: 20,
  imgSlot: '深夜码头，大北风，一个人影站在船舷边。要含蓄，不要直接表现跳海。',
  text: [
    '接船第一天，做饭的严师傅在船舱里喊了起来。',
    { t: '「杀人了、杀人了。」', cls: 'shout' },
    '他喊到半夜。船长把他叫上去骂了一顿。',
    '快一点的时候，他自己走出去，跳进了海里。'
  ],
  choices: [
    { label: '跟着大家一起出去找。', to: 'p_board',
      effect: { standing: +4, body: -6 } },
    { label: '站在甲板上看着黑水。', to: 'p_board',
      effect: { flags: { saw_yan: true }, body: -2 } },
    { label: '回舱躺着。这不关你的事。', to: 'p_board',
      effect: { standing: -5, body: +3 } }
  ]
},

p_board: {
  id: 'p_board', act: '序', place: '石岛外海', date: '2010 年 12 月 27 日',
  mood: 'calm', ambience: 'engine', day: 37,
  text: [
    '严师傅被捞上来了。船上的头一顿饭，换了老夏做。',
    '出海那天，公司一次出去七条船。',
    '开出十分钟，边检走了。船停下，另一条船把没证的人送上来。'
  ],
  choices: [
    { label: '十多个没证的人里，有个瘦瘦的年轻人。', to: 'p_smoke',
      effect: { rel: { liu: +1 } } },
    { label: '原来这趟是黑着出去的。', to: 'p_smoke',
      effect: { flags: { knows_stowaway: true }, standing: +2 } }
  ]
},

p_smoke: {
  id: 'p_smoke', act: '序', place: '船员寝室', date: '2010 年 12 月',
  mood: 'calm', ambience: 'engine', day: 38,
  imgSlot: '狭窄的船员寝室，上铺堆满整条整条的香烟，垒到顶。',
  text: [
    '刘贵夺带了 165 条烟。从床铺一直垒到顶上。',
    { t: '「这他妈上了船还不知道咋回事，烟我不能亏了自己。」', cls: 'q' },
    '这些烟是赊的。'
  ],
  choices: [
    { label: '跟他搭话。', to: 'n_sea',
      effect: { rel: { liu: +1 } } },
    { label: '不说话。这人不好接近。', to: 'n_sea',
      effect: { rel: { liu: -1 }, body: +2 } }
  ]
},

/* ── 夜航 0：去秘鲁的路上，四十天 ── */
n_sea: {
  id: 'n_sea', act: '第一幕', place: '去秘鲁的途中', date: '2011 年 1 月',
  mood: 'calm', ambience: 'sea', day: 45,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act1', draws: 2, then: 'p_arrive' },
  text: [
    '一望无际的时候，心里挺敞亮。',
    '看不着陆地以后，心里就没底了。',
    '你一直吐。吐到第十六天，好了。'
  ]
},

/* ═══════════════════ 海上黑工 ═══════════════════ */

p_arrive: {
  id: 'p_arrive', act: '第一幕', place: '秘鲁海域', date: '2011 年 2 月 28 日',
  mood: 'calm', ambience: 'sea', day: 90,
  text: [
    '四十天之后到地方。晚上天黑开始钓。',
    '灯一打开，鱿鱼冲着光就游过来。',
    '把钩下下去，感觉有鱼往上薅就行了。'
  ],
  choices: [
    { label: '认真学。问刘贵夺该下多深。', to: 'p_lamps',
      effect: { rel: { liu: +2 }, body: -6 } },
    { label: '自己摸索。', to: 'p_lamps',
      effect: { body: -3 } }
  ]
},

p_lamps: {
  id: 'p_lamps', act: '第一幕', place: '钓鱿甲板', date: '2011 年 3 月',
  mood: 'calm', ambience: 'sea', day: 95, img: 'img/lamps.jpg',
  text: [
    '船头挂了十几个灯。一个两千瓦。',
    '人眼睛看时间长了受不了，都流眼泪。',
    '大鱿鱼有近两百斤。一个人拽不动，两个人拽。'
  ],
  choices: [
    { label: '死死盯着水面。', to: 'p_unload',
      effect: { body: -10, standing: +3 } },
    { label: '低头避光，慢慢来。', to: 'p_unload',
      effect: { body: -5, standing: -2 } },
    { label: '把灯下的位置让给别人。', to: 'p_unload',
      effect: { body: -3, standing: +1, rel: { zhao: +1 } } }
  ]
},

p_unload: {
  id: 'p_unload', act: '第一幕', place: '舱底', date: '2011 年 4 月',
  mood: 'tense', ambience: 'engine', day: 120,
  text: [
    '鱼满了，得下到舱底卸货。',
    '一人 50 盘，一盘 30 斤，往上举。',
    { t: '「比挖煤窑还要苦。」', cls: 'q' }
  ],
  choices: [
    { label: '下去卸。两天一夜不睡也卸。', to: 'n_labor',
      effect: { body: -16, standing: +6 } },
    { label: '下去，但找机会歇。', to: 'n_labor',
      effect: { body: -8, standing: +1 } },
    { label: '装病待在甲板上。', to: 'n_labor',
      effect: { body: +4, standing: -8 } }
  ]
},

n_labor: {
  id: 'n_labor', act: '第一幕', place: '钓鱿甲板', date: '2011 年 4 月',
  mood: 'calm', ambience: 'sea', day: 130,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act1', draws: 2, then: 'p_contract' },
  text: [
    '几个月下来，你钓的总比别人少。',
    '刘贵夺最多。有一个月钓了 13000 多斤。',
    '他的钩歪了也不修，就钓那么多。'
  ]
},

p_contract: {
  id: 'p_contract', act: '第一幕', place: '船员寝室', date: '2011 年 5 月',
  mood: 'tense', ambience: 'engine', day: 150,
  text: [
    '船上开始传：工资不对。',
    '合同写保底四万五，其实是按一斤鱿鱼两毛五算。',
    '钓够了，才拿得到那么多。'
  ],
  choices: [
    { label: '自己算一遍账。', to: 'p_captain',
      effect: { flags: { did_math: true }, body: -4 } },
    { label: '不信。那么大公司还能差这几个人的钱。', to: 'p_captain',
      effect: { flags: { trusted_company: true } } },
    { label: '去问船长。', to: 'p_captain',
      effect: { standing: -3, flags: { asked_captain: true } } }
  ]
},

p_captain: {
  id: 'p_captain', act: '第一幕', place: '船长室门口', date: '2011 年 5 月',
  mood: 'tense', ambience: 'engine', day: 155,
  text: [
    '有人去找船长李承权，说想提前回国。',
    { t: '「你们回不去了。都没办船员证，别的船不敢搭你们，那是偷渡。」', cls: 'q' },
    { t: '「你们干也得干，不干也得干！」', cls: 'shout' }
  ],
  choices: [
    { label: '船长说得对。你确实回不去。', to: 'p_ma',
      effect: { body: -5, flags: { knows_trapped: true } } },
    { label: '偷渡也得回。这钱不能白干。', to: 'p_ma',
      effect: { rel: { liu: +1 }, flags: { wants_home: true } } },
    { label: '合同上盖的是假公章。你们是黑工。', to: 'p_ma',
      effect: { flags: { knows_fake_seal: true }, standing: +3 } }
  ]
},

p_ma: {
  id: 'p_ma', act: '第一幕', place: '寝室下铺', date: '2011 年 5 月 18 日',
  mood: 'calm', ambience: 'sea', day: 160,
  imgSlot: '窄小的上下铺，下铺坐着个瘦弱的年轻人，膝上放着一本日记。看不清脸。',
  text: [
    '马玉超睡你下铺。刚毕业没多久，爱写日记。',
    { t: '「轮船下面就是万丈深渊，毕竟在太平洋彼岸，谈何容易。」', cls: 'q' },
    '他刚给家里打完电话。'
  ],
  choices: [
    { label: '「还有一年半。熬得住。」', to: 'p_liu',
      effect: { rel: { ma: +2 }, flags: { comforted_ma: true } } },
    { label: '「你写的这些，别让刘贵夺看见。」', to: 'p_liu',
      effect: { rel: { ma: +1 }, flags: { warned_ma: true } } },
    { label: '不说话。你也不想说话。', to: 'p_liu',
      effect: { body: +2 } }
  ]
},

p_liu: {
  id: 'p_liu', act: '第一幕', place: '寝室', date: '2011 年 5 月',
  mood: 'tense', ambience: 'quiet', day: 165,
  text: [
    '你回寝室，看见刘贵夺铺上放着个小笔记本。',
    '上面记着一串数字。',
    { t: '「航行坐标。没事儿闲着玩记的。」', cls: 'q' }
  ],
  choices: [
    { label: '「你记这个干啥。」', to: 'p_rule',
      effect: { rel: { liu: +1 }, flags: { saw_notebook: true } } },
    { label: '什么都不问，走开。', to: 'p_rule',
      effect: { flags: { saw_notebook: true }, body: -2 } },
    { label: '把这事告诉船长。', to: 'p_rule',
      effect: { standing: -6, rel: { liu: -3 }, flags: { told_captain: true } },
      tone: 'risk' }
  ]
},

p_rule: {
  id: 'p_rule', act: '第一幕', place: '后甲板', date: '2011 年 6 月',
  mood: 'blood', ambience: 'sea-tense', day: 168,
  text: [
    '刘贵夺来找你。他说干活累，公司黑，合同上的钱肯定拿不到。',
    '他想回家，跟公司打官司。他说他认识济南比较好的律师。',
    { t: '「公海上杀人不犯法。」', cls: 'shout' }
  ],
  choices: [
    { label: '「你想干什么。」', to: 'n_plan',
      effect: { rel: { liu: +1 }, flags: { heard_sea_rule: true } } },
    { label: '「这话你别跟我说。」转身走。', to: 'n_plan',
      effect: { rel: { liu: -1 }, body: -2, flags: { heard_sea_rule: true } } },
    { label: '把这句话记住。', to: 'n_plan',
      effect: { flags: { heard_sea_rule: true }, standing: +2 } }
  ]
},

n_plan: {
  id: 'n_plan', act: '第一幕', place: '钓鱿甲板', date: '2011 年 6 月',
  mood: 'tense', ambience: 'sea', day: 170,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act1', draws: 2, then: 'p_knife' },
  text: [
    '刘贵夺秘密串联了半个月。',
    '你每天仍旧按时把鱼钩沉到平静的海里。',
    '船快到智利了。'
  ]
},

p_knife: {
  id: 'p_knife', act: '第一幕', place: '前甲板', date: '2011 年 6 月 16 日',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  imgSlot: '前甲板上的一把新磨过的鱼刀特写，旁边是一只伸过来的手。',
  text: [
    '那天晚上你刚钓上一条鱿鱼，想起前甲板有把新磨的鱼刀。',
    '取完回来，刘贵夺趴在船舱口。',
    { t: '「你刀挺好，你借我看看，借我使使。」', cls: 'q' },
    { t: '「一会儿劫船，你参不参加？」', cls: 'shout' }
  ],
  choices: [
    { label: '「不参加。」', to: 'p_refuse',
      effect: { flags: { refused_hijack: true }, rel: { liu: -2 }, body: -4 } },
    { label: '「算我一个。」', to: 'p_join',
      effect: { flags: { joined_hijack: true }, rel: { liu: +3 }, standing: +8, body: -4 },
      tone: 'risk' },
    { label: '「我胆儿不行，干不了这个。」', to: 'p_refuse',
      effect: { flags: { refused_hijack: true }, rel: { liu: -1 } } },
    { label: '「先看看。」——拖住他，谁也不得罪。', to: 'p_refuse',
      effect: { flags: { wavered: true }, standing: -2, rel: { liu: -1 } } }
  ]
},

p_refuse: {
  id: 'p_refuse', act: '第一幕', place: '钓鱿甲板', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  text: [
    '他说「行」，拿着你的鱼刀走了。',
    '你回到钓鱼的位置。那阵儿瞅谁谁像跟他一伙的。',
    '你知道一会儿要出事。你不敢告诉谁。'
  ],
  choices: [
    { label: '装作在钓鱼。', to: 'a2_hijack',
      effect: { body: -6, flags: { played_dumb: true } } },
    { label: '收好鱼钩，挪到人多的甲板上去。', to: 'a2_hijack',
      effect: { body: -3, standing: +2 } }
  ]
},

p_join: {
  id: 'p_join', act: '第一幕', place: '钓鱿甲板', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 171,
  text: [
    '同意劫船的有十四个人。全是普通船员。',
    '没有一个人在有职务。',
    { t: '「我们只不过是想劫船回国和公司打官司。」', cls: 'q' }
  ],
  choices: [
    { label: '跟着刘贵夺上舷梯。', to: 'a2_hijack',
      effect: { rel: { liu: +2 }, body: -8, flags: { went_up: true } } },
    { label: '留在甲板上守舷梯。', to: 'a2_hijack',
      effect: { body: -4, standing: +3, flags: { guarded_ladder: true } } }
  ]
}

  });
})();
