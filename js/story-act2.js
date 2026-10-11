/* ═══════════════════════════════════════════════════════════════
   《公海》第二幕  劫船 → 剿灭管理层 → 内斗
   2011 年 6 月 16 日 — 7 月 24 日
   ─────────────────────────────────────────────────────────────
   素材同第一幕。老夏之死、温斗温密、王永波、马玉超失踪、
   崔勇投诚、黄金波告密、包德之死，全部按庭审记录走。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  var E = window.GH.Engine;

  E.register({

/* ═══════════════════ 第一条人命 ═══════════════════ */

a2_hijack: {
  id: 'a2_hijack', act: '第二幕', place: '甲板', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 172, img: 'img/hijack.jpg',
  text: [
    '船上的大灯很亮，晃得人眼睛疼。',
    '舷梯一边一个人守着，拿把刀。',
    '黄金波这几天因为贫血晕倒过。今晚他把鞋都穿立正了。'
  ],
  choices: [
    { label: '站在原地。', to: 'a2_xia',
      effect: { body: -4 } },
    { label: '往大甲板走。', to: 'a2_xia',
      effect: { body: -2, standing: +1 } },
    { label: '把马玉超从下铺拉起来，带在身边。', to: 'a2_xia',
      effect: { rel: { ma: +2 }, body: -5, flags: { kept_ma_close: true } } }
  ]
},

a2_xia: {
  id: 'a2_xia', act: '第二幕', place: '舵楼', date: '2011 年 6 月 16 日 23:20',
  mood: 'blood', ambience: 'sea-tense', day: 172, img: 'img/barrel.jpg',
  text: [
    '做饭的老夏拿把刀上去了。',
    { t: '「这帮小逼崽子还想劫船。」', cls: 'shout' },
    { t: '「放倒、放倒。」', cls: 'shout' },
    '老夏往舵楼左后方的油桶跑，跑到油桶前就摔倒了。'
  ],
  choices: [
    { label: '冲上去拦。', to: 'a2_deck',
      effect: { standing: -6, body: -12, blood: 0, flags: { tried_to_stop: true } },
      tone: 'blood' },
    { label: '站着不动。脚钉在甲板上。', to: 'a2_deck',
      effect: { body: -6, flags: { froze: true } } },
    { label: '转身回舱。', to: 'a2_deck',
      effect: { body: -3, standing: -3 } }
  ]
},

a2_deck: {
  id: 'a2_deck', act: '第二幕', place: '二层甲板', date: '2011 年 6 月 17 日 凌晨',
  mood: 'blood', ambience: 'quiet', day: 173,
  text: [
    '黄金波从右边过来，问你有没有烟。',
    '递烟的时候，你发现他的手一个劲地抖。',
    { t: '「老夏死了。」', cls: 'q' }
  ],
  choices: [
    { label: '「他怎么死的。」', to: 'a2_baobao',
      effect: { rel: { huang: +2 }, body: -4, flags: { asked_how: true } } },
    { label: '把整包烟塞给他。', to: 'a2_baobao',
      effect: { rel: { huang: +2 }, smokes: -1 } },
    { label: '什么都没说。', to: 'a2_baobao',
      effect: { body: -2 } }
  ]
},

a2_baobao: {
  id: 'a2_baobao', act: '第二幕', place: '十二人间', date: '2011 年 6 月 17 日',
  mood: 'tense', ambience: 'quiet', day: 173,
  text: [
    '姜晓龙在二层甲板喊你：小赵，你上来一趟。',
    '他说：你上屋睡觉去吧，没有事儿，那谁没了，明天早晨你开始做饭。',
    '你上去，拖鞋在甲板上放着。全是血。'
  ],
  choices: [
    { label: '光脚进去。躺下。', to: 'a2_quiet',
      effect: { body: -5, flags: { saw_slippers: true } } },
    { label: '把拖鞋冲干净再进去。', to: 'a2_quiet',
      effect: { body: -8, standing: +2 } },
    { label: '找老船员包宝成说话。', to: 'a2_quiet',
      effect: { rel: { zhao: +1 }, body: -3,
                flags: { heard_baobao: true } } }
  ]
},

/* ── 夜航：往回跑的十几天 ── */
a2_quiet: {
  id: 'a2_quiet', act: '第二幕', place: '十二人间', date: '2011 年 6 月',
  mood: 'calm', ambience: 'sea', day: 178,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a2_wendou' },
  text: [
    '船开始往回跑。通讯设备拆了，救生筏用钢筋绑死。',
    '四个人一班，每天拿刀轮流走岗，看着船长和大副。',
    '十几天里其实挺轻松。心想着就要回家了。'
  ]
},

/* ═══════════════════ 高音喇叭 ═══════════════════ */

a2_wendou: {
  id: 'a2_wendou', act: '第二幕', place: '十二人间', date: '2011 年 7 月 20 日',
  mood: 'blood', ambience: 'sea-tense', day: 205, img: 'img/speaker.jpg',
  text: [
    '那天 12 点多天就亮了。你醒了，躺在那儿抽烟。',
    '好几个床上没有人。',
    '出去没到两分钟，听「啊」一声。又听噗通一声。',
    '忽然，前面舵楼的音乐放得响，嗷嗷的。'
  ],
  choices: [
    { label: '听出这是掩饰。他们在放音乐盖住声音。', to: 'a2_wang',
      effect: { body: -5, flags: { knew_music_cover: true } } },
    { label: '躺回去。不出声。', to: 'a2_wang',
      effect: { body: -3, standing: -2 } },
    { label: '下床，去找马玉超。', to: 'a2_wang',
      effect: { body: -8, rel: { ma: +2 }, flags: { looked_for_ma: true } } }
  ]
},

a2_wang: {
  id: 'a2_wang', act: '第二幕', place: '寝室', date: '2011 年 7 月 20 日',
  mood: 'blood', ambience: 'sea-tense', day: 205,
  imgSlot: '寝室地面与行李箱之间的一双靴子特写，画面压抑，不出现伤者。',
  text: [
    '刘成建和包德拿刀进来，直接奔二副王永波床上。',
    '一人扎一刀。二副醒了，拿手去够他们，没够着，掉地下。',
    '然后刘贵夺就进来了。'
  ],
  choices: [
    { label: '半躺在床上，不动。', to: 'a2_brother',
      effect: { body: -8 } },
    { label: '闭上眼，装睡。', to: 'a2_brother',
      effect: { body: -5, standing: -2 } },
    { label: '上去帮忙按住他。', to: 'a2_brother',
      effect: { blood: +1, standing: +12, rel: { liu: +2 }, body: -14,
                flags: { helped_kill_wang: true } },
      tone: 'blood' }
  ]
},

a2_brother: {
  id: 'a2_brother', act: '第二幕', place: '寝室', date: '2011 年 7 月 20 日',
  mood: 'blood', ambience: 'quiet', day: 205,
  text: [
    { t: '「哎，这不是二副嘛，你咋躺地下了？」', cls: 'q' },
    '说一句给一刀。「肠子都淌出来了。」一刀。「这咋整？」又给一刀。',
    '他站起来，四周看看，转过身看着你。'
  ],
  choices: [
    { label: '看着他的眼睛。', to: 'a2_magone',
      effect: { rel: { liu: +1 }, body: -10, flags: { looked_at_liu: true } } },
    { label: '把脸转向墙。', to: 'a2_magone',
      effect: { body: -8, standing: -2 } },
    { label: '「刘哥。」', to: 'a2_magone',
      effect: { rel: { liu: +2 }, body: -8, flags: { called_him_brother: true } } }
  ]
},

a2_magone: {
  id: 'a2_magone', act: '第二幕', place: '寝室', date: '2011 年 7 月 21 日',
  mood: 'blood', ambience: 'deep', day: 206, img: 'img/emptybunk.jpg',
  text: [
    { t: '「当初让你加入你不加入，现在知道害怕了？」', cls: 'q' },
    '他满脸带笑。又说：「你是我兄弟，我先不动你。」',
    '天亮以后，马玉超不见了。东西都没少。'
  ],
  choices: [
    { label: '问刘贵夺，马玉超去哪了。', to: 'a2_hide',
      effect: { rel: { liu: -1 }, body: -5,
                flags: { asked_about_ma: true } } },
    { label: '什么都不问。你已经知道答案。', to: 'a2_hide',
      effect: { body: -8, flags: { ma_gone: true } } },
    { label: '去他的铺上，把那本日记收起来。', to: 'a2_hide',
      effect: { rel: { ma: +3 }, body: -4, flags: { kept_ma_diary: true } } }
  ]
},

a2_hide: {
  id: 'a2_hide', act: '第二幕', place: '船上各处', date: '2011 年 7 月 21 日',
  mood: 'blood', ambience: 'deep', day: 206,
  text: [
    '刘贵夺在船员面前说：他咋跳海了？没打算动他，他是我的人，是我的卧底。',
    '你四处看了一遍，想找个地方藏起来。',
    '船底的水舱能进去，可螺丝是拧上的，盖不上。夹板里是泡沫，爬不进去。'
  ],
  choices: [
    { label: '抄一份杀人名单，藏进船底隔板。', to: 'a2_after',
      effect: { body: -10, standing: -4,
                flags: { hid_evidence: true } }, tone: 'risk' },
    { label: '试着把救生筏上的钢筋弄开。', to: 'a2_after',
      effect: { body: -14, standing: -3, flags: { tried_raft: true } } },
    { label: '放弃。船上就这么大点地方。', to: 'a2_after',
      effect: { body: -4, flags: { no_way_out: true } } },
    { label: '没有一点能藏的地方。那就走马玉超那条路。', to: 'e_ma',
      effect: { flags: { chose_the_sea: true } }, tone: 'risk' }
  ]
},

/* ── 夜航：清洗之后的几天 ── */
a2_after: {
  id: 'a2_after', act: '第二幕', place: '后甲板', date: '2011 年 7 月 22 日',
  mood: 'blood', ambience: 'sea', day: 207,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a2_cui' },
  text: [
    '甲板上没有一点血。他们连夜洗了。',
    '你走来走去，不知道该干点什么。',
    '撒尿都得先观察一阵。冷不丁推一把就下去了。'
  ]
},

a2_cui: {
  id: 'a2_cui', act: '第二幕', place: '后甲板', date: '2011 年 7 月 22 日',
  mood: 'tense', ambience: 'sea-tense', day: 207,
  text: [
    '崔勇来找你。「你跟刘贵夺比较好，你帮我去劝劝他。」',
    { t: '「咱俩不行加入他们得了。真有事儿的话，能往后靠就尽量往后靠。」', cls: 'q' }
  ],
  choices: [
    { label: '「行。我跟你去。」', to: 'a2_jiang',
      effect: { rel: { cui: +2 }, flags: { sought_join: true } } },
    { label: '「我不去。你也别去。」', to: 'a2_jiang',
      effect: { rel: { cui: -1 }, body: -3, flags: { refused_join: true } } },
    { label: '「这事我自己拿主意。」', to: 'a2_jiang',
      effect: { body: -5 } }
  ]
},

a2_jiang: {
  id: 'a2_jiang', act: '第二幕', place: '二层甲板', date: '2011 年 7 月 22 日',
  mood: 'tense', ambience: 'quiet', day: 207,
  text: [
    '你们先找姜晓龙。他说：最好别加入，这事儿没法回头。',
    { t: '「我说了不算，我自己活哪天还不知道呢。」', cls: 'q' },
    '第二次杀人之后，刘贵夺搬进了船长室。'
  ],
  choices: [
    { label: '去船长室门口喊刘哥。', to: 'a2_money',
      effect: { flags: { asked_liu: true }, body: -4 } },
    { label: '算了。回去做饭。', to: 'a2_money',
      effect: { body: +3, standing: -3 } }
  ]
},

a2_money: {
  id: 'a2_money', act: '第二幕', place: '甲板', date: '2011 年 7 月 23 日',
  mood: 'blood', ambience: 'sea-tense', day: 208,
  text: [
    '刘贵夺在甲板召集全体船员。他说去日本需要钱。',
    '让每个人给家里打电话，说自己得了阑尾炎，要家里打五千块。',
    { t: '「那个人叫韩俐。」', cls: 'q' }
  ],
  choices: [
    { label: '给家里打。', to: 'a2_huang',
      effect: { body: -6, standing: +2, flags: { called_home: true } } },
    { label: '打给妈，但只说「过段时间就回去了」。', to: 'a2_huang',
      effect: { body: -4, rel: { liu: -1 }, flags: { told_truth_home: true } } },
    { label: '不打。把电话还回去。', to: 'a2_huang',
      effect: { standing: -6, body: -8, flags: { refused_call: true } } }
  ]
},

a2_huang: {
  id: 'a2_huang', act: '第二幕', place: '船长室', date: '2011 年 7 月 24 日',
  mood: 'blood', ambience: 'deep', day: 209,
  text: [
    '黄金波来找刘贵夺：「有个很严重的事情，我得告诉你。」',
    { t: '「是不是包德他们想杀了我？」', cls: 'q' },
    '包德拉拢过黄金波：刘贵夺打算只带两三个黑龙江老乡去日本，剩下的全杀了。'
  ],
  choices: [
    { label: '黄金波是你的朋友。你早就看出他不对劲。', to: 'a2_before',
      effect: { rel: { huang: +1 }, flags: { knew_huang_double: true } } },
    { label: '你什么都没看出来。', to: 'a2_before',
      effect: { body: -4 } }
  ]
},

/* ── 夜航：内斗前夜 ── */
a2_before: {
  id: 'a2_before', act: '第二幕', place: '寝室', date: '2011 年 7 月 24 日',
  mood: 'blood', ambience: 'deep', day: 210,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a2_baode' },
  text: [
    '刘贵夺去找了船长李承权。',
    { t: '「我手上有七八条人命，剩下的人想要活命，必须沾点血。」', cls: 'q' },
    { t: '「二副是包德杀的。」——这是假话。', cls: 'inner' }
  ]
},

a2_baode: {
  id: 'a2_baode', act: '第二幕', place: '甲板', date: '2011 年 7 月 24 日 夜',
  mood: 'blood', ambience: 'sea-tense', day: 210,
  imgSlot: '甲板上抹在脸上的一道血，和一张仰起来的脸。极端克制，不做血腥特写。',
  text: [
    '刘贵夺把包德等四人的名字写在纸条上，让同伙传阅。',
    '他骗包德说船长要杀崔勇，需要借包德的鱼刀。包德把刀交了。',
    '包德到甲板时，船长已经持刀在那里等。'
  ],
  choices: [
    { label: '站在暗处看。', to: 'a2_horn',
      effect: { body: -8, flags: { watched_baode: true } } },
    { label: '上去补一刀，站到刘贵夺那边。', to: 'a2_horn',
      effect: { blood: +1, standing: +10, body: -12, rel: { liu: +2 },
                flags: { sided_with_liu: true } }, tone: 'blood' },
    { label: '往机舱跑。离甲板越远越好。', to: 'a2_horn',
      effect: { body: -10, standing: -5, flags: { fled_to_engine: true } } }
  ]
},

a2_horn: {
  id: 'a2_horn', act: '第二幕', place: '寝室', date: '2011 年 7 月 24 日 夜',
  mood: 'blood', ambience: 'deep', day: 210,
  text: [
    '包德受伤后向内蒙同乡大喊：「都出来！」',
    '没有一个人敢动。',
    '第一次杀人的崔勇见包德满身是血，兴奋地上前，把血抹在自己脸上。'
  ],
  choices: [
    { label: '听崔勇喊：「我沾血了，我沾血了！」', to: 'a2_noodle',
      effect: { body: -8, rel: { cui: -1 }, flags: { heard_cui_blood: true } } },
    { label: '躺回床上，闭眼。', to: 'a2_noodle',
      effect: { body: -6 } }
  ]
},

a2_noodle: {
  id: 'a2_noodle', act: '第二幕', place: '甲板 / 寝室', date: '2011 年 7 月 25 日 凌晨',
  mood: 'blood', ambience: 'sea-tense', day: 211,
  text: [
    '船上那个高音喇叭突然响了。先是船长的声音：',
    { t: '「包德，你同伙还有谁，你赶紧说吧，我都知道了。」', cls: 'shout' },
    '然后变成刘贵夺的：「你以为黄金波是谁的人？」',
    '「单国喜，出来！」——「啊」，「噗通」。又叫邱荣华，「啊」一声没了。'
  ],
  choices: [
    { label: '躺着，一动不动。', to: 'a2_deep',
      effect: { body: -10 } },
    { label: '把耳朵堵上。', to: 'a2_deep',
      effect: { body: -6, flags: { covered_ears: true } } },
    { label: '爬起来，去厨房。至少那里有活干。', to: 'a2_deep',
      effect: { body: -4, standing: +3, flags: { went_to_galley: true } } }
  ]
},

/* ── 夜航：尾声 ── */
a2_deep: {
  id: 'a2_deep', act: '第二幕', place: '船长室', date: '2011 年 7 月 25 日 凌晨',
  mood: 'blood', ambience: 'deep', day: 211,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a3_valve' },
  text: [
    '刘成建来叫你。你磨磨蹭蹭上去，以为要弄你。',
    '刘贵夺坐在床边，看起来很累，又有点轻松的感觉。',
    { t: '「别害怕，没有事儿。手上没沾血的，回国就完事儿了。」', cls: 'q' },
    { t: '「你到厨房去煮些面条吧，办完事儿人都饿了，先吃点。」', cls: 'q' }
  ]
}

  });
})();
