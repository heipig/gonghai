/* ═══════════════════════════════════════════════════════════════
   《公海》storylet 池（QBN）
   ─────────────────────────────────────────────────────────────
   这些不是主线，是"夜里有人来找你"。
   每一段都带解锁条件，条件全部由玩家状态表达：
     · require.bloodMin / bloodMax —— 手上有没有血
     · require.rel.{he|bayaer|dayong|captain|han|ge}.min/max —— 谁信你
     · require.flag / noFlag / anyOf / noneOf —— 你知道什么、做过什么
     · require.smokesMin —— 你还有没有烟

   关键设计：**沾过血的人和没沾血的人，看到的是两条船。**
   act2 池子里有专供 bloodMax:0 的段（还有人拿你当人），
   也有专供 bloodMin:1 的段（你已经被算进那一伙了）。
   这是 QBN 相对剧情树最大的作者红利：加一段反应，不用分叉整棵树。

   选项一律不写 to —— 夜航由引擎的队列推进。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  window.GH.Engine.register({

/* ═══════════════ 池一 · 出海（航程前段）═══════════════ */

s_a1_dayong: {
  id: 's_a1_dayong', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '第一幕 · 出海', place: '船员舱 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '大勇摸到你铺边，蹲下来，声音压得很低。',
    { t: '「借我两条烟。回去还你三条。」', cls: 'q' },
    '他在船上打牌输了不少。你带的三十条烟，是你两年的量。',
    '你没说话。他就那么蹲着，不走。'
  ],
  choices: [
    { label: '给他两条。', effect: { smokes: -2, rel: { dayong: +2 }, flags: { lent_smoke: true } } },
    { label: '给他一条，让他别再赌。',
      effect: { smokes: -1, rel: { dayong: +1 }, flags: { warned_gambling: true } } },
    { label: '「不借。你输的不是我的钱。」',
      effect: { rel: { dayong: -2 }, body: +2, flags: { refused_dayong: true } } }
  ]
},

s_a1_han: {
  id: 's_a1_han', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '第一幕 · 出海', place: '船尾 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '老韩在船尾抽烟，看见你过来，往旁边挪了挪，给你让出一块地方。',
    '他跑了二十多年船。他说他见过的事，比你想的多得多。',
    { t: '「小子，记着一件事。在这条船上，你别当第一个说话的，也别当最后一个。」', cls: 'q' },
    '你问他这话什么意思。',
    { t: '「意思就是，你多听，少说。听明白了，就知道该往哪儿站。」', cls: 'q' }
  ],
  choices: [
    { label: '「那您往哪儿站？」',
      effect: { rel: { han: +2 }, flags: { asked_han_side: true }, body: -2 } },
    { label: '把这话记住，不接话。',
      effect: { rel: { han: +1 }, flags: { learned_silence: true } } },
    { label: '「我不站。我就想回家。」',
      effect: { rel: { han: -1 }, standing: -2, flags: { said_want_home: true } } }
  ]
},

s_a1_ge: {
  id: 's_a1_ge', storylet: true, pool: 'act1', weight: 1, once: true,
  act: '第一幕 · 出海', place: '船员舱 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '老葛又开始了。他喝了点酒，把自己的事翻出来讲，讲得眉飞色舞。',
    { t: '「我跟你们说，我弄死过人。劳改过两回。」', cls: 'q' },
    '舱里有人捧场，有人笑。老葛越讲越大声。',
    '后来你才知道，他那两次都是盗窃。',
    '但那天晚上，没有人去查他到底杀没杀过人——大家更愿意信他杀过。因为有个杀过人的在船上，好像反而让人安心：至少他不是冲你来的。'
  ],
  choices: [
    { label: '捧他两句，跟这种人别结仇。',
      effect: { rel: { ge: +2 }, standing: +2 } },
    { label: '「你没杀过人。你偷东西进去的。」当众拆他。',
      effect: { rel: { ge: -3 }, standing: -3, body: -2, flags: { called_ge_out: true } },
      tone: 'risk' },
    { label: '走开。听不下去。',
      effect: { body: +1 } }
  ]
},

s_a1_manzi: {
  id: 's_a1_manzi', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '第一幕 · 出海', place: '甲板 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '周满蹲在灯底下写东西。你走过去，看见他手里那个本子。',
    '他记得很整齐：某天、某个人、说了什么。字歪歪扭扭，但一笔不落。',
    { t: '「松哥让我记的。」他说，「他说记下来，回去有用。」', cls: 'q' },
    '你问他都记了什么。他把本子合上了，冲你笑了一下。',
    '他只有十九岁，笑起来还是个孩子。'
  ],
  choices: [
    { label: '夸他字好，跟他处好关系。',
      effect: { rel: { he: +1 }, standing: +2, flags: { befriended_manzi: true } } },
    { label: '「你记的这些，将来是能送人进监狱的。」',
      effect: { rel: { he: -2 }, standing: -2, flags: { warned_manzi: true }, body: -2 } },
    { label: '什么都不说，记住有这么个本子。',
      effect: { flags: { knows_notebook: true }, standing: +1 } }
  ]
},

s_a1_smoke: {
  id: 's_a1_smoke', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '第一幕 · 出海', place: '贺松铺位前 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '贺松那面烟墙矮下去了。一百六十五条，抽了几个月，剩不到三分之一。',
    '他坐在铺上，手里空着，看着那面墙。',
    '你没见过他这个样子。',
    { t: '「你说，照这个算法，我这一趟是给谁干？」', cls: 'q' },
    '他不是在问你。他是在跟自己算账。'
  ],
  choices: [
    { label: '递他一条自己的烟。',
      effect: { smokes: -1, rel: { he: +3 }, flags: { gave_he_smoke: true } } },
    { label: '「你带的比我多十倍。你还愁？」',
      effect: { rel: { he: -1 } } },
    { label: '「你心里有别的主意。」把话挑明。',
      effect: { rel: { he: +2 }, flags: { called_it_early: true }, standing: +2, body: -3 },
      tone: 'risk' }
  ]
},

s_a1_hit: {
  id: 's_a1_hit', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '第一幕 · 出海', place: '甲板 · 白天',
  mood: 'tense', ambience: 'engine',
  text: [
    '船长又打人了。',
    '这回是因为分鱼慢。那个船员蹲在地上，捂着脸，没人敢扶。',
    '船长骂了两句，回船长室去了。甲板上的人各自低头干活，像什么都没发生。',
    '过了一会儿，那个挨打的自己站起来了，捡起鱼刀，接着分鱼。'
  ],
  choices: [
    { label: '过去搭把手，跟他一起干完。',
      effect: { standing: +4, body: -4, flags: { helped_beaten: true } } },
    { label: '跟旁边的人小声说：这船长早晚出事。',
      effect: { standing: +2, flags: { predicted_captain: true } } },
    { label: '低头干自己的活。',
      effect: { body: +1, standing: -2 } }
  ]
},

s_a1_bayaer: {
  id: 's_a1_bayaer', storylet: true, pool: 'act1', weight: 1, once: true,
  act: '第一幕 · 出海', place: '机舱口 · 夜',
  mood: 'calm', ambience: 'engine',
  text: [
    '巴雅尔手下的一个人塞给你一块牛肉干。内蒙带来的，很硬，嚼半天。',
    '那人汉语不好，说了半天你才听懂：巴雅尔问你，跟贺松是不是一路的。',
    '你说不是。他点点头，又给了你一块。',
    '你回头看，巴雅尔正站在机舱口看着这边。他没说话，也没躲。'
  ],
  choices: [
    { label: '把牛肉干收下。这个情你认。',
      effect: { rel: { bayaer: +2 }, flags: { took_beef: true } } },
    { label: '还回去。「我不站队。」',
      effect: { rel: { bayaer: -1 }, standing: -2, flags: { refused_side: true } } },
    { label: '收下，但回头告诉贺松这件事。',
      effect: { rel: { bayaer: +1, he: +2 }, flags: { told_he_about_bayaer: true } },
      tone: 'risk' }
  ]
},

s_a1_zhou: {
  id: 's_a1_zhou', storylet: true, pool: 'act1', weight: 1, once: true,
  act: '第一幕 · 出海', place: '厨房 · 夜',
  mood: 'tense', ambience: 'sea',
  text: [
    '你去厨房找吃的，看见老周在磨刀。',
    '磨得很细。一块磨石，一把刀，来回推。他抬头看见你，笑了一下。',
    { t: '「这船上，我一个做饭的，谁都能撵。可谁也得吃饭。」', cls: 'q' },
    '他把刀举起来，对着灯看刃口。',
    { t: '「你说是不是？」', cls: 'q' }
  ],
  choices: [
    { label: '「周师傅，你少说两句吧。」劝他。',
      effect: { rel: { ge: -1 }, standing: +1, flags: { warned_cook: true } } },
    { label: '「是。」敷衍过去，赶紧走。',
      effect: { body: +1 } },
    { label: '「你惹的人不少。自己当心。」',
      effect: { standing: +2, flags: { warned_cook: true }, body: -2 } }
  ]
},

s_a1_phone: {
  id: 's_a1_phone', storylet: true, pool: 'act1', weight: 1, once: true,
  act: '第一幕 · 出海', place: '驾驶室 · 黄昏',
  mood: 'calm', ambience: 'sea',
  text: [
    '船上有一部卫星电话，平时锁着。那天不知道为什么开着，能打。',
    '前面一个人打完了，把话筒递给你。',
    { t: '「打吧，三分钟。」', cls: 'q' },
    '你捏着话筒，突然想不起来要说什么。',
    '你想起镇上那个烧烤摊，想起她家里问你的那句话。'
  ],
  choices: [
    { label: '打给对象。说你挺好的，快回去了。',
      effect: { body: +6, flags: { called_girlfriend: true } } },
    { label: '打给家里。只报个平安。',
      effect: { body: +4, rel: { han: +1 }, flags: { called_home: true } } },
    { label: '想想还是放下了。没什么好说的。',
      effect: { standing: -1, flags: { no_call: true } } }
  ]
},

s_a1_photo: {
  id: 's_a1_photo', storylet: true, pool: 'act1', weight: 1, once: true,
  act: '第一幕 · 出海', place: '十二人间 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '有人把照片拿出来了。一个女儿，五六岁，扎两个辫子。',
    '照片在舱里传了一圈。每个人接过去看的时候，都看得很久。',
    '轮到你手上，你也看了很久。照片边角已经磨白了——他看的次数比你多得多。',
    '传回去的时候，那人已经睡着了，照片放在胸口。'
  ],
  choices: [
    { label: '替他记着这个人的名字。',
      effect: { standing: +3, flags: { remembers_daughter: true }, body: -1 } },
    { label: '把自己的也拿出来给大家看。',
      effect: { standing: +4, rel: { dayong: +1 }, flags: { showed_photo: true } } },
    { label: '不去看。看一眼就多一个牵挂。',
      effect: { body: +2, standing: -1, flags: { kept_detached: true } } }
  ]
},

s_a1_injury: {
  id: 's_a1_injury', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '第一幕 · 出海', place: '舱底 · 卸货中',
  mood: 'tense', ambience: 'engine',
  text: [
    '卸货卸到第二夜，你的手滑了。',
    '一盘鱼砸下去，正中你的脚背。三十斤。',
    '你咬着牙没出声，把盘子捡起来接着举。等卸完货爬出舱口，鞋里全是血。',
    '船上没有医生。有人递给你一卷电工胶布。'
  ],
  choices: [
    { label: '自己缠上，接着干。',
      effect: { body: -12, standing: +5, flags: { pushed_through: true } } },
    { label: '去找贺松，让他顶你两天。',
      effect: { body: -4, rel: { he: +2 }, flags: { asked_he_help: true } } },
    { label: '去找船医要药——船上根本没有船医。',
      effect: { body: -8, standing: -2 } },
    { label: '去厨房找老周要点酒消毒。',
      effect: { body: -6, rel: { ge: +1 }, standing: +2, flags: { cook_helped_you: true } } }
  ]
},

s_a1_song: {
  id: 's_a1_song', storylet: true, pool: 'act1', weight: 1, once: true,
  act: '第一幕 · 出海', place: '甲板 · 深夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '不知道谁先开的头，有人唱起来了。',
    '一首很老的歌，唱得很跑调。一个人唱，两个人跟，后来大半个甲板上的人都在哼。',
    '没有人笑。船在黑水里走，灯把海面照出一块白。',
    '歌唱到一半，有人停了。接着第二个人停。最后只剩下一个人还在唱，唱了两句，也停了。'
  ],
  choices: [
    { label: '跟着唱完最后一句。',
      effect: { standing: +3, body: +2, flags: { sang: true } } },
    { label: '记住这一刻。以后你会想起它。',
      effect: { body: +3, flags: { remembers_song: true } } },
    { label: '回舱躺着。',
      effect: { body: +2 } }
  ]
},

/* ═══════════════ 池二 · 归航（沾血之后/之前）═══════════════ */

s_a2_clean_hands: {
  id: 's_a2_clean_hands', storylet: true, pool: 'act2', weight: 3, once: true,
  require: { bloodMax: 0 },
  act: '第二幕 · 归航', place: '盥洗池 · 清晨',
  mood: 'tense', ambience: 'sea',
  text: [
    '你每天早上都在同一个池子边洗手。',
    '水是凉的，从海里抽上来的。你搓得很慢。',
    '船往回走了。老周没了三天。奇怪的是，日子过得很正常——照常吃饭，照常值班，照常有人说笑话。',
    '这件事让你害怕的不是他们，是你自己也觉得正常。'
  ],
  choices: [
    { label: '看着水里的自己，把这件事记住。',
      effect: { body: -3, flags: { kept_conscience: true }, standing: -2 } },
    { label: '洗完脸，回舱里去，跟大家一样。',
      effect: { standing: +4, body: +2, flags: { blended_in: true } } },
    { label: '多洗一会儿。手是干净的，你想确认这件事。',
      effect: { body: -2, flags: { washed_often: true } } }
  ]
},

s_a2_manzi_check: {
  id: 's_a2_manzi_check', storylet: true, pool: 'act2', weight: 2, once: true,
  require: { bloodMin: 1 },
  act: '第二幕 · 归航', place: '过道 · 夜',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '周满拿着本子来找你。他把本子翻开，翻到其中一页。',
    { t: '「那天晚上，你站在哪儿？」', cls: 'q' },
    '他把笔尖压在纸上，等着。',
    '你忽然明白这个本子是干什么用的了。它不是日记。它是一份名单——谁在哪一晚做过什么。',
    '被写进去的人，将来跑不掉。'
  ],
  choices: [
    { label: '如实说。你确实做了。',
      effect: { rel: { he: +2 }, standing: +4, flags: { on_the_list: true } } },
    { label: '撒谎。说你在船头，什么都没看见。',
      effect: { rel: { he: -1 }, standing: -3, flags: { lied_to_manzi: true } },
      tone: 'risk' },
    { label: '「本子给我看一眼。」',
      effect: { rel: { he: -3 }, standing: -4, flags: { asked_notebook: true } },
      tone: 'risk' }
  ]
},

s_a2_blood_after: {
  id: 's_a2_blood_after', storylet: true, pool: 'act2', weight: 2, once: true,
  require: { bloodMin: 1 },
  act: '第二幕 · 归航', place: '船尾 · 深夜',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '你在船尾站着。手上那道口子还没好——不是干活弄的，是握刀握的，虎口裂了。',
    '贺松走过来，站在你旁边。他很难得地主动说话。',
    { t: '「你那天做得对。」', cls: 'q' },
    '你问他哪一天。',
    { t: '「哪天都对。」他说，「上了这条道的人，都是一样的。你别想着回去能摘干净。」', cls: 'q' },
    '他递给你一支烟。他自己没点。'
  ],
  choices: [
    { label: '接过来，点上。',
      effect: { rel: { he: +2 }, standing: +4, flags: { accepted_brotherhood: true } } },
    { label: '「我没想摘干净。但我也没想跟你一样。」',
      effect: { rel: { he: -2 }, standing: -3, flags: { drew_a_line: true }, body: -3 },
      tone: 'risk' },
    { label: '「回去以后，你会怎么说？」',
      effect: { rel: { he: +1 }, flags: { asked_he_plan: true }, standing: +2 } }
  ]
},

s_a2_han_please: {
  id: 's_a2_han_please', storylet: true, pool: 'act2', weight: 2, once: true,
  act: '第二幕 · 归航', place: '船尾 · 夜',
  mood: 'tense', ambience: 'sea',
  text: [
    '老韩找到你的时候，脸色不对。',
    { t: '「那天晚上你看见什么了，回去一个字都别说。」', cls: 'q' },
    '他说这话时手在抖。他跑了二十多年船，你第一次见他手抖。',
    { t: '「你说了，他们跑不了；可你也在船上。这船上的事，一个人说了，十一个人一起完。」', cls: 'q' },
    '他盯着你，等你点头。'
  ],
  choices: [
    { label: '点头。「我什么都不知道。」',
      effect: { rel: { han: +2 }, standing: +3, flags: { promised_silence: true } } },
    { label: '「我要是想说呢？」',
      effect: { rel: { han: -2 }, standing: -2, flags: { considered_confession: true }, body: -3 },
      tone: 'risk' },
    { label: '不点头也不摇头，走开。',
      effect: { rel: { han: -1 }, flags: { kept_options: true } } }
  ]
},

s_a2_dayong_join: {
  id: 's_a2_dayong_join', storylet: true, pool: 'act2', weight: 2, once: true,
  act: '第二幕 · 归航', place: '十二人间 · 夜',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '大勇来找你。他这两天一直找机会跟贺松说话，贺松没理他。',
    { t: '「你跟松哥说得上话。你帮我说说，让我也加入。」', cls: 'q' },
    '他脸上的表情你认得——不是狠，是怕。',
    { t: '「不加入的那些，早晚被收拾。你看不出来吗？」', cls: 'q' },
    '你自己的位置也不稳。你去替他说话，就得拿你的位置去押。'
  ],
  choices: [
    { label: '去替他说话。',
      effect: { rel: { dayong: +3, he: -1 }, standing: -2, flags: { vouched_for_dayong: true } } },
    { label: '「别加入。沾了血就回不了头。」',
      effect: { rel: { dayong: -1 }, flags: { warned_dayong: true }, body: -2 } },
    { label: '「你自己的事自己办。」',
      effect: { rel: { dayong: -3 }, standing: +1 } }
  ]
},

s_a2_tian: {
  id: 's_a2_tian', storylet: true, pool: 'act2', weight: 2, once: true,
  act: '第二幕 · 归航', place: '机舱四人间 · 夜',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '你路过机舱四人间，二副田志国在里面。门口坐着看管他的人，靠着墙打瞌睡。',
    '田志国看见你，把手从被子里伸出来，朝你招了招。',
    { t: '「你叫什么来着？」他嗓子哑了，「你能不能……给我一口水。」', cls: 'q' },
    '他本来是最有位置的人之一。现在他连一杯水都得跟人讨。',
    '看管的人翻了个身，没醒。'
  ],
  choices: [
    { label: '去舀一杯水给他，快进快出。',
      effect: { standing: -4, body: -2, flags: { watered_tian: true }, rel: { captain: +2 } },
      tone: 'risk' },
    { label: '装作没听见，走过去。',
      effect: { standing: +1, flags: { ignored_tian: true } } },
    { label: '把看管的人叫醒，让他给水。',
      effect: { standing: +2, rel: { he: +1 }, flags: { reported_tian: true } } }
  ]
},

s_a2_jiao: {
  id: 's_a2_jiao', storylet: true, pool: 'act2', weight: 2, once: true,
  act: '第二幕 · 归航', place: '机舱 · 深夜',
  mood: 'tense', ambience: 'engine',
  text: [
    '大管轮焦德发蹲在机舱底下，手里拿着个手电，照着一排管子。',
    '他看见你，没躲。反而朝你招手。',
    { t: '「你过来看看。」', cls: 'q' },
    '手电照着舱底一个阀门。铜的，拳头大，上面结着一层盐。',
    { t: '「这是海底总阀。开了这个，这船就完了。」他说得很平，「这条船上，只有我知道它在哪儿——现在你也知道了。」', cls: 'q' },
    '他关掉手电。机舱里黑得看不见人。',
    { t: '「你记着就行。」', cls: 'q' }
  ],
  choices: [
    { label: '把位置记死。',
      effect: { flags: { knows_valve: true }, body: -3, standing: -1 } },
    { label: '「你告诉我这个干什么？」',
      effect: { flags: { knows_valve: true, asked_jiao_why: true }, rel: { captain: +1 }, body: -2 } },
    { label: '走开。你不想知道这种事。',
      effect: { standing: +2, flags: { refused_valve: true } } }
  ]
},

s_a2_smoke: {
  id: 's_a2_smoke', storylet: true, pool: 'act2', weight: 2, once: true,
  act: '第二幕 · 归航', place: '船员舱 · 夜',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '有人翻你的铺。',
    '你回去的时候，烟少了两条，铺也被动过。',
    '舱里有五个人，都躺着，都不看你。',
    '烟在这条船上已经不是烟了。是钱，是筹码，是能换人替你值一次夜班的东西。'
  ],
  choices: [
    { label: '把剩下的一把摔在铺上：「谁拿的，站出来。」',
      effect: { standing: +4, rel: { ge: -1 }, flags: { confronted_theft: true }, body: -3 },
      tone: 'risk' },
    { label: '不吭声，把剩下的烟换个地方藏。',
      effect: { flags: { hid_smokes: true }, body: +1, standing: -1 } },
    { label: '去告诉贺松。这种事得有人管。',
      effect: { rel: { he: +2 }, standing: +3, flags: { reported_to_he: true } } },
    { label: '算了。两条烟换一条命，不贵。',
      effect: { smokes: -2, flags: { let_it_go: true }, standing: +1 } }
  ]
},

s_a2_note: {
  id: 's_a2_note', storylet: true, pool: 'act2', weight: 1, once: true,
  act: '第二幕 · 归航', place: '甲板 · 深夜',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '船长邵广海趁看管的人走开，从舱门缝里塞给你一张纸条。',
    '上面是几个字，写得极快：<em>包德一伙行凶后乘木筏逃走，剩下十一人无辜。</em>',
    '他盯着你，用口型说了一个字：藏。',
    '这是编好的谎。这是要你们十一个人一起背下来的谎。',
    '你手里捏着这张纸，纸边被汗浸软了。'
  ],
  choices: [
    { label: '藏起来。这是全船的命。',
      effect: { flags: { holds_cover_story: true }, standing: +3, rel: { captain: +2 } } },
    { label: '把纸条还回去。「我不拿这个。」',
      effect: { rel: { captain: -2 }, standing: -2, flags: { refused_cover: true } } },
    { label: '记住内容，纸条撕了扔海里。',
      effect: { flags: { holds_cover_story: true, memorized_cover: true }, body: -2 } }
  ]
},

s_a2_overhear: {
  id: 's_a2_overhear', storylet: true, pool: 'act2', weight: 2, once: true,
  act: '第二幕 · 归航', place: '过道 · 夜',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '你听见有人在过道尽头说话，声音压得很低。',
    '你听清了一句：',
    { t: '「先把劫船那伙人绑了，回去向公司邀功。船长的意思是，公司会保我们。」', cls: 'q' },
    '你没敢动。你不知道说话的是谁，但你知道这话要是真做了，这条船上要再死一批人。',
    '你现在手里有一个消息。消息在这条船上，比刀值钱。'
  ],
  choices: [
    { label: '立刻去告诉贺松。',
      effect: { rel: { he: +3, captain: -3 }, standing: +4, flags: { told_he_plot: true } },
      tone: 'risk' },
    { label: '谁也不说。烂在肚子里。',
      effect: { body: -4, flags: { kept_plot_secret: true } } },
    { label: '去告诉老韩，让他自己当心。',
      effect: { rel: { han: +2 }, standing: -2, flags: { told_han_plot: true } } },
    { label: '去问船长，是不是他说的。',
      effect: { rel: { captain: +1 }, standing: -3, flags: { confronted_captain: true } },
      tone: 'risk' }
  ]
},

s_a2_list: {
  id: 's_a2_list', storylet: true, pool: 'act2', weight: 2, once: true,
  require: { bloodMin: 1 },
  act: '第二幕 · 归航', place: '甲板 · 夜',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '贺松把一张纸条传下来，让每个人看过再往下传。',
    '上面写着四个名字。你认得其中两个。',
    '他站在灯底下，声音不大。',
    { t: '「今晚。谁不去，谁跟他们一起。」', cls: 'q' },
    '纸条传到下一只手。没有人问为什么。'
  ],
  choices: [
    { label: '记住这四个名字。',
      effect: { flags: { knows_list: true }, standing: +3, body: -3 } },
    { label: '把纸条撕了。「我不干这种事。」',
      effect: { standing: -10, rel: { he: -3 }, flags: { tore_the_list: true }, body: -5 },
      tone: 'blood' },
    { label: '问一句：「他们做什么了？」',
      effect: { standing: -4, rel: { he: -1 }, flags: { questioned_list: true } },
      tone: 'risk' }
  ]
},

s_a2_mirror: {
  id: 's_a2_mirror', storylet: true, pool: 'act2', weight: 1, once: true,
  require: { bloodMin: 2 },
  act: '第二幕 · 归航', place: '盥洗池 · 凌晨',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '水面上有个人在看你。',
    '你盯着看了很久，才认出来那是你自己。',
    '你已经想不起来上船前那半年在干什么了。镇上那个烧烤摊、那场下不完的雨、她家里问你的那句话——都像是别人的事。',
    '你试着回想你是从哪一天开始变的。想不起来。',
    { t: '你只知道，第一刀很难，第二刀不难。', cls: 'inner' }
  ],
  choices: [
    { label: '把水泼掉，回舱。',
      effect: { body: -4, standing: +3, flags: { stopped_looking: true } } },
    { label: '一直看着，直到天亮。',
      effect: { body: -10, flags: { faced_himself: true }, standing: -2 } },
    { label: '数一数自己手上到底有几条命。',
      effect: { body: -6, flags: { counted: true }, standing: +1, tone: 'blood' } }
  ]
},

/* ═══════════════ 池三 · 内讧与漂流 ═══════════════ */

s_a3_storm: {
  id: 's_a3_storm', storylet: true, pool: 'act3', weight: 2, once: true,
  act: '第三幕 · 漂流', place: '甲板 · 台风中',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '超强台风从西太平洋卷过来，正撞在这片海上。',
    '船已经不能动了，机舱进了水，只能漂着等救援。浪从船头打上来，人得抓着栏杆才站得住。',
    '有人吐，有人躺在甲板上不动，有人在喊一个谁都不认识的名字。',
    '你抓着栏杆。手心里全是铁锈和盐。'
  ],
  choices: [
    { label: '去把甲板上没固定住的东西都绑一遍。',
      effect: { body: -12, standing: +5, flags: { worked_the_storm: true } } },
    { label: '抓着栏杆，撑过去。',
      effect: { body: -6, standing: -1 } },
    { label: '进舱里躲着。甲板上多一个人不多。',
      effect: { body: -2, standing: -5, flags: { hid_from_storm: true } } }
  ]
},

s_a3_food: {
  id: 's_a3_food', storylet: true, pool: 'act3', weight: 2, once: true,
  act: '第三幕 · 漂流', place: '厨房 · 夜',
  mood: 'tense', ambience: 'sea',
  text: [
    '剩十一个人，剩的东西还够吃很久——本来是给三十三个人准备的。',
    '问题是没人想做饭。老周死了，厨房空了。',
    '你进去的时候，看见有人蹲在地上，手里捏着半包方便面，干嚼。',
    '他看见你，把面往怀里一按。'
  ],
  choices: [
    { label: '动手做饭，做十一个人的。',
      effect: { body: -8, standing: +8, flags: { fed_everyone: true } } },
    { label: '自己找点吃的，各自解决。',
      effect: { body: +3, standing: -3 } },
    { label: '把那个人的面拿过来，分成两份。',
      effect: { body: -3, standing: +4, flags: { shared_food: true } } }
  ]
},

s_a3_name: {
  id: 's_a3_name', storylet: true, pool: 'act3', weight: 1, once: true,
  act: '第三幕 · 漂流', place: '船头 · 黄昏',
  mood: 'calm', ambience: 'sea',
  text: [
    '有人在你旁边坐下来。你们一起看着前面。前面只有水。',
    { t: '「你叫什么来着？」他问。', cls: 'q' },
    '你说了。他点点头，说了他自己的。',
    '你们在一条船上待了八个多月，刚刚才知道对方叫什么。',
    { t: '「回去以后，」他说，「咱俩别见面了。」', cls: 'q' }
  ],
  choices: [
    { label: '「行。」',
      effect: { body: +3, flags: { made_pact: true } } },
    { label: '「我记着你了。」',
      effect: { body: +2, standing: +2, flags: { remembered_him: true } } },
    { label: '不说话。你也不知道回去以后是什么样。',
      effect: { body: +1 } }
  ]
},

s_a3_pray: {
  id: 's_a3_pray', storylet: true, pool: 'act3', weight: 1, once: true,
  act: '第三幕 · 漂流', place: '船员寝室 · 夜',
  mood: 'calm', ambience: 'sea',
  text: [
    '船员寝室的墙上写着四个字：万能的父。',
    '不知道是谁写的，也不知道是什么时候写的。字很难看，刻进去的。',
    '有人在墙前面站了很久，什么都没说，也没跪。',
    '你走过去的时候，他回头看了你一眼，然后让开了，像是给你腾出位置。'
  ],
  choices: [
    { label: '站一会儿。',
      effect: { body: +4, standing: -1, flags: { stood_at_wall: true } } },
    { label: '走开。这四个字救不了谁。',
      effect: { body: +1, standing: +1, flags: { turned_from_wall: true } } },
    { label: '在那四个字下面，加上自己的名字。',
      effect: { body: +2, flags: { wrote_name: true }, standing: +2 } }
  ]
},

s_a3_sleep: {
  id: 's_a3_sleep', storylet: true, pool: 'act3', weight: 2, once: true,
  act: '第三幕 · 漂流', place: '十二人间 · 夜',
  mood: 'tense', ambience: 'sea',
  text: [
    '你已经三天没睡了。',
    '一闭眼就醒。醒了就听——听有没有脚步声停在门口。',
    '同舱的人在打呼。以前你觉得吵，现在你靠这个声音确认他们还在。',
    '天亮还有几个钟头。你数着船体晃动，数到后来自己都不知道数到几了。'
  ],
  choices: [
    { label: '硬撑着。睡着了可能就醒不了。',
      effect: { body: -8, standing: +2, flags: { never_slept: true } } },
    { label: '找个人一起值夜，两个人轮流眯。',
      effect: { body: +6, standing: +2, flags: { shared_watch: true } } },
    { label: '睡。该来的躲不掉。',
      effect: { body: +14, standing: -4, flags: { slept_anyway: true } } }
  ]
},

s_a3_light: {
  id: 's_a3_light', storylet: true, pool: 'act3', weight: 1, once: true,
  act: '第三幕 · 漂流', place: '船头 · 黎明',
  mood: 'calm', ambience: 'sea',
  text: [
    '天快亮的时候，你在船头看见海上有一个光点。',
    '很小，一闪一闪。你盯着它看了十分钟，它不动。也可能是颗星，也可能是眼睛看花了。',
    '你回头喊人。来的人看了半天，说：',
    { t: '「你别乱喊。船上现在经不起乱。」', cls: 'q' },
    '那个光点后来被海面挡住了。'
  ],
  choices: [
    { label: '把位置记下来，等天亮再看。',
      effect: { flags: { saw_light: true }, body: -3 } },
    { label: '坚持让船长把通讯设备打开，再发一次求救。',
      effect: { standing: +4, rel: { captain: +1 }, body: -6, flags: { pushed_rescue: true } } },
    { label: '不说了。回舱里躺着。',
      effect: { body: +2, standing: -2, flags: { kept_light_secret: true } } }
  ]
}

  });
})();
