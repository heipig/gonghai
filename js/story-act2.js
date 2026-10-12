/* ═══════════════════════════════════════════════════════════════
   《公海》第二幕  劫船 → 剿灭管理层 → 内斗
   2011 年 6 月 16 日 — 7 月 24 日
   ─────────────────────────────────────────────────────────────
   素材同第一幕。老夏之死、温斗温密、王永波、马玉超失踪、
   崔勇投诚、黄金波告密、包德之死，全部按庭审记录走。

   第二幕的骨：这条船上的人开始互相消耗。
   主角学轮机这件事在这里第一次变成玩法——刘贵夺会来问他油耗。
   他怎么回答，决定温斗的命，也决定他后面有没有那把钥匙。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  var E = window.GH.Engine;

  E.register({

/* ═══════════════════ 2011.6.16 劫船 ═══════════════════ */

a2_hijack: {
  id: 'a2_hijack', act: '第二幕', place: '甲板 → 船长室', date: '2011 年 6 月 16 日 23:00',
  mood: 'blood', ambience: 'sea-tense', day: 172, img: 'img/hijack.jpg',
  text: [
    '船上的大灯很亮，晃得人眼睛疼。',
    '舷梯一边一个人守着，一人一把刀。',
    '黄金波这几天因为贫血晕倒过。今晚他把鞋穿立正了。',
    '刘贵夺带着人上去了。你听见船长室那边一声闷响。',
    '李承权被按在床上，刀架在脖子上。',
    { t: '「起锚，往国内开。」', cls: 'q' },
    '船长不肯。有人用刀背敲他。',
    '过了很久，船头掉了过来。'
  ],
  choices: [
    { label: '站在原地，什么也不做。', to: 'a2_xia',
      effect: { body: -4 } },
    { label: '往大甲板走，离船长室远一点。', to: 'a2_xia',
      effect: { body: -2, standing: +1 } },
    { label: '把马玉超从下铺拉起来，带在身边。', to: 'a2_xia',
      effect: { rel: { ma: +2 }, body: -5, flags: { kept_ma_close: true } } }
  ]
},

a2_xia: {
  id: 'a2_xia', act: '第二幕', place: '楼梯口', date: '2011 年 6 月 16 日 23:40',
  mood: 'blood', ambience: 'sea-tense', day: 172, img: 'img/barrel.jpg',
  text: [
    { t: '船头调过来之前，你就把马玉超从下铺拉起来了。他一直跟着你。', if: { flag: 'kept_ma_close' } },
    '大师傅老夏听见动静，从厨房里冲出来，手里拿着刀。',
    '他往船长室那边冲。',
    { t: '「这帮小逼崽子还想劫船。」', cls: 'shout' },
    '姜晓龙在楼梯口把他堵住了。',
    '你不知道是谁先动的手。你只听见有人喊：',
    { t: '「放倒、放倒！」', cls: 'shout' },
    '老夏倒在地上。有人把他抱起来，扔进了海里。',
    '海面上浮着一个油桶。那是他落水的地方，也是你们唯一的记号。'
  ],
  choices: [
    { label: '过去看一眼。', to: 'a2_xia2',
      effect: { body: -5, flags: { saw_xia_die: true } } },
    { label: '转过身去。', to: 'a2_xia2',
      effect: { body: -2, standing: -2 } },
    { label: '把楼梯口的灯关掉。', to: 'a2_xia2',
      effect: { body: -3, standing: +3, flags: { turned_off_light: true } } }
  ]
},

a2_xia2: {
  id: 'a2_xia2', act: '第二幕', place: '十二人间', date: '2011 年 6 月 17 日',
  mood: 'blood', ambience: 'engine', day: 173,
  text: [
    '那一夜后来就安静了。船在往西开。',
    '天亮以后，甲板上什么都没有了。他们连夜洗过。',
    '早饭照常做。人少了几个，剩下的都低头吃饭。',
    { t: '没有人提老夏。一个人都没有。', cls: 'inner' },
    '刘贵夺说，他们只是想把船开回去，跟公司打官司。',
    '你说不出哪里不对。你只是觉得，回不去了。'
  ],
  choices: [
    { label: '照常上工。', to: 'a2_silence',
      effect: { body: +2, flags: { kept_working: true } } },
    { label: '把老夏的东西收起来。', to: 'a2_silence',
      effect: { standing: -3, body: -4, flags: { kept_xia_things: true } } },
    { label: '去找马玉超。他脸色很难看。', to: 'a2_silence',
      effect: { rel: { ma: +2 }, body: -2 } }
  ]
},

a2_silence: {
  id: 'a2_silence', act: '第二幕', place: '十二人间', date: '2011 年 6 月 18 日',
  mood: 'blood', ambience: 'quiet', day: 175,
  imgSlot: '一只拖鞋丢在舱室地上，鞋面上是已经发黑的血。只拍物，不拍人。',
  text: [
    { t: '第二天你照常上了工。手上的活没停，脑子一直没转。', if: { flag: 'kept_working' } },
    { t: '你把老夏的东西收进了一个纸箱。你不知道要交给谁。', if: { flag: 'kept_xia_things' } },
    '黄金波一直手抖。他抖了好几天。',
    '他说他只是想回家，他说他没想干这个。',
    '他拖鞋上全是血。他把那双拖鞋扔了，后来一直光着脚。',
    { t: '你注意到，谁都不愿意站在舷边。', cls: 'inner' },
    '有人开始把铺位挪到靠墙的那一侧。',
    '没人说为什么，但所有人都懂。'
  ],
  choices: [
    { label: '跟黄金波说两句话。', to: 'n_quiet',
      effect: { rel: { huang: +2 }, body: -2 } },
    { label: '把自己的铺位也挪到靠墙那边。', to: 'n_quiet',
      effect: { body: -1, flags: { moved_bunk: true } } },
    { label: '一个人去船尾坐着。那里没别人。', to: 'n_quiet',
      effect: { body: -3, flags: { sat_alone: true } } }
  ]
},

/* ── 夜航 A ── */
n_quiet: {
  id: 'n_quiet', act: '第二幕', place: '太平洋 · 返航途中', date: '2011 年 6 月',
  mood: 'tense', ambience: 'sea', day: 178,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a2_fuel' },
  text: [
    '船按着罗盘往西走。按这个走法，还有十几天就能到。',
    '可这十几天没有人熬得住。',
    '你把每天的钓组收好，把日子记在本子上。',
    '你还活着。这一点让你每天夜里都醒一次。'
  ]
},

/* ═══════════════════ 油耗：轮机主角的代价 ═══════════════════ */

a2_fuel: {
  id: 'a2_fuel', act: '第二幕', place: '机舱口', date: '2011 年 7 月上旬',
  mood: 'tense', ambience: 'engine', day: 192,
  imgSlot: '机舱口，一个人站在楼梯下往上说话，上面有人俯身看着他。逆光。',
  text: [
    { t: '有一天刘贵夺下来找你。他站在机舱楼梯口，没往下走。', if: { noneOf: ['peeked_engine', 'saw_engine_room', 'hid_in_engine'] } },
    { t: '有一天刘贵夺来找你。他记得你下过机舱。', unless: { noneOf: ['peeked_engine', 'saw_engine_room', 'hid_in_engine'] } },
    { t: '「这几天船的油耗大了好几倍。辅机也少了两个。」', cls: 'q' },
    { t: '「你下去过。底下那几个人，有没有不对劲的？」', cls: 'q' },
    '他疑心很重。这段时间他一会儿说这个在后边捅咕捅咕，一会儿说那个聚堆说话不敢大声。',
    '你看得出来，他要找一个答案。',
    { t: '而你手里正好有一个。', cls: 'inner' }
  ],
  choices: [
    { label: '「底下不像坏了。倒像是有人拆的。」', to: 'a2_engine',
      effect: { flags: { blamed_wendou: true }, standing: +8, rel: { liu: +2 },
                body: -6 }, tone: 'risk',
      require: { anyOf: ['peeked_engine', 'saw_engine_room', 'hid_in_engine'],
                 why: '你没下过机舱，说不出这个话。' } },
    { label: '「机器老了，正常。别听人瞎说。」', to: 'a2_engine',
      effect: { flags: { covered_engine: true }, rel: { liu: -2 },
                standing: -3, body: -4 } },
    { label: '「我下去查一遍，查完再跟你说。」', to: 'a2_engine',
      effect: { flags: { investigating: true }, body: -9, standing: +2 } },
    { label: '「我只管甲板。机器的事你问温斗。」', to: 'a2_engine',
      effect: { flags: { pushed_to_wendou: true }, rel: { liu: -3 },
                body: +2 }, tone: 'risk' }
  ]
},

a2_engine: {
  id: 'a2_engine', act: '第二幕', place: '机舱底层', date: '2011 年 7 月上旬',
  mood: 'tense', ambience: 'engine', day: 194,
  text: [
    '你自己下去了。机舱里四十多度，主机的声音把人包起来。',
    '两个辅机的位置空着，螺栓上还留着新拧过的痕迹。',
    '不是坏的，是被人拆下来搬走了。',
    '你沿着管路往船底走。越往下越黑，只剩一盏小灯。',
    '船底水舱的盖子开着。有人比你先到。',
    '是王延龙。他蹲在一个大阀边上，手里拿着扳手。',
    { t: '「你下来干啥。」', cls: 'q' },
    { t: '「刘哥让我看看辅机。」你说。', cls: 'q' },
    '他看了你一会儿。没喊人，也没让你上去。',
    { t: '「这是海底总阀。全船就这一个，能把海水放进来。」', cls: 'q' },
    { t: '「记住它在哪儿。别跟人说是我说的。」', cls: 'q' },
    { t: '你分不清他这话是警告，还是别的什么。', cls: 'inner' }
  ],
  choices: [
    { label: '把阀的位置记死在心里。', to: 'a2_fuel_report',
      effect: { flags: { knows_valve: true }, body: -4 } },
    { label: '趁他走了，把阀柄拆下来藏了。', to: 'a2_fuel_report',
      effect: { flags: { knows_valve: true, hid_valve_handle: true },
                standing: -4, body: -6 }, tone: 'risk' },
    { label: '上去，什么都不说。', to: 'a2_fuel_report',
      effect: { flags: { knows_valve: true }, body: -3 } }
  ]
},

a2_fuel_report: {
  id: 'a2_fuel_report', act: '第二幕', place: '甲板', date: '2011 年 7 月上旬',
  mood: 'blood', ambience: 'sea-tense', day: 196,
  text: [
    '你上去的时候，刘贵夺在等你。',
    '他看着你，等你开口。',
    { t: '这可能是这条船上，你唯一一次能决定别人死活的机会。', cls: 'inner' }
  ],
  choices: [
    { label: '「是温斗。他不希望船回去。」', to: 'a2_speaker',
      effect: { flags: { blamed_wendou: true }, standing: +10, rel: { liu: +3 },
                body: -8 }, tone: 'risk' },
    { label: '「查了，没查出问题。就是老了。」', to: 'a2_speaker',
      effect: { flags: { covered_engine: true }, rel: { liu: -1 },
                body: -4, standing: -2 } },
    { label: '「是王延龙。他这几天不对劲。」', to: 'a2_speaker',
      effect: { flags: { blamed_wangyanlong: true }, standing: +6,
                body: -5 }, tone: 'risk' },
    { label: '「我不知道。你别问我。」', to: 'a2_speaker',
      effect: { flags: { refused_answer: true }, rel: { liu: -4 },
                standing: -6, body: -3 } }
  ]
},

/* ═══════════════════ 2011.7.20 剿灭管理层 ═══════════════════ */

a2_speaker: {
  id: 'a2_speaker', act: '第二幕', place: '十二人间', date: '2011 年 7 月 20 日 凌晨',
  mood: 'blood', ambience: 'sea-tense', day: 206, img: 'img/speaker.jpg',
  text: [
    { t: '你把温斗的名字说出去了。之后刘贵夺就没再正眼看过你。', if: { flag: 'blamed_wendou' }, cls: 'inner' },
    { t: '你说没查出问题。刘贵夺盯着你看了很久，最后什么也没说就走了。', if: { flag: 'covered_engine' } },
    { t: '你把王延龙的名字说出去了。你跟他并不熟，你只知道他话少。', if: { flag: 'blamed_wangyanlong' }, cls: 'inner' },
    { t: '你说你不知道。刘贵夺笑了一下，那个笑很难看。', if: { flag: 'refused_answer' } },
    { t: '后来你想过很多次：如果那天你换一句话说，会不会不一样。', unless: { anyOf: ['blamed_wendou', 'covered_engine', 'blamed_wangyanlong', 'refused_answer'] } },
    '那天十二点多（北京时间）天就亮了。你醒了，躺在那儿抽烟。',
    '从出事开始，十二人间的人就不多了，在屋里待着的时候也少。',
    '那天你看见好几个床上没有人。',
    '这时候刘成建进来了，问有没有人醒着，醒了出去一趟。',
    '你瞅瞅他，没放声。他掉头出去了。',
    '四五分钟他又进来，还问有没有人醒着。你下铺的刘刚醒了，问啥事儿。',
    { t: '「你出来一趟，没有事儿，帮个忙。」', cls: 'q' },
    '出去没到两分钟，你听见「啊」一声。声还不算大——出门那儿是个烟筒，突突老响。',
    '你没往心里去。又听见噗通一声。',
    '忽然，前面舵楼那边音乐放得响，嗷嗷声挺大。',
    { t: '那阵儿你感觉有点不对劲儿了。', cls: 'inner' }
  ],
  choices: [
    { label: '躺着不动。', to: 'a2_wang',
      effect: { body: -6, flags: { lay_still: true } } },
    { label: '起来，把门从里面顶上。', to: 'a2_wang',
      effect: { body: -4, standing: -3, flags: { barred_door: true } } },
    { label: '你也出去。站在看得见人的地方。', to: 'a2_wang',
      effect: { body: -8, standing: +4, flags: { went_out: true }, blood: 0 } }
  ]
},

a2_wang: {
  id: 'a2_wang', act: '第二幕', place: '十二人间', date: '2011 年 7 月 20 日 凌晨',
  mood: 'blood', ambience: 'sea-tense', day: 206,
  text: [
    { t: '你躺着没动。你听见自己的心跳比外面的动静还响。', if: { flag: 'lay_still' } },
    { t: '你把门从里面顶上了。后来你才想起来，顶的是自己人的门。', if: { flag: 'barred_door' } },
    { t: '你跟着出去了。你站在看得见人的地方，一句话都没说。', if: { flag: 'went_out' } },
    '过了没几分钟，刘成建和包德两个人进来了，拿着刀。',
    '他们直接奔二副王永波的床上去。那阵儿他正在睡觉。',
    '到那儿一人扎了一刀。二副醒了，拿手去够他俩，没够着，直接掉地下了。',
    '完了又上去一人扎了一刀。',
    '然后刘贵夺就进来了。',
    { t: '「哎，这不是二副嘛，你咋躺地下了？」', cls: 'q' },
    '说一句给一刀。',
    { t: '「肠子都淌出来了。」', cls: 'q' },
    '一刀。',
    { t: '「这咋整？」', cls: 'q' },
    '又一刀。',
    '当时行李箱在你和二副中间挡着，你看不着他。',
    { t: '但刘贵夺那个姿势你看得很清楚。猫着腰扎的。', cls: 'inner' },
    '鱼刀拔出来呲呲响。二副躺在地下哼哼，喘着气。'
  ],
  choices: [
    { label: '半躺在床上，一动不能动。', to: 'a2_brother',
      effect: { body: -8, flags: { froze: true } } },
    { label: '喊一声：「刘哥！」', to: 'a2_brother',
      effect: { body: -6, standing: -2, flags: { called_out: true } } },
    { label: '过去，帮他把人抬起来。', to: 'a2_brother',
      effect: { blood: +1, standing: +12, body: -10,
                flags: { helped_kill: true } }, tone: 'risk' }
  ]
},

a2_brother: {
  id: 'a2_brother', act: '第二幕', place: '十二人间', date: '2011 年 7 月 20 日 凌晨',
  mood: 'blood', ambience: 'sea-tense', day: 206,
  text: [
    { t: '你半躺在床上，一动没动。', if: { flag: 'froze' } },
    { t: '你喊了一声「刘哥」。他回头看了你一眼，又转回去了。', if: { flag: 'called_out' } },
    { t: '你过去帮他把人抬起来。你的手是干净地伸出去的。', if: { flag: 'helped_kill' } },
    '刘贵夺动完手，站起来，四周看看，转过身看着你。',
    { t: '「当初让你加入你不加入，现在知道害怕了？」', cls: 'q' },
    '他那表情感觉挺兴奋，还满脸带笑。',
    '然后又说：',
    { t: '「你是我兄弟，我先不动你。」', cls: 'q' },
    { t: '但是你一点儿都不相信他说这话。', cls: 'inner' },
    '总共才认识几个月。当时已经十条人命了。',
    { t: '谁能信谁的。', cls: 'beat' },
    '后来他又对你说了一句：',
    { t: '「你好好回家。」', cls: 'q' },
    '你不知道他哪句话是真的。'
  ],
  choices: [
    { label: '「哥，我记得。」', to: 'a2_ma_night',
      effect: { rel: { liu: +2 }, standing: +2, body: -3 } },
    { label: '「我不怕。我没什么可怕的。」', to: 'a2_ma_night',
      effect: { rel: { liu: -1 }, standing: -4, body: -5 } },
    { label: '你想说一句马玉超。张了张嘴，没说出来。', to: 'a2_ma_night',
      effect: { rel: { ma: +1 }, body: -5, flags: { wanted_to_speak_for_ma: true } } },
    { label: '「我能不能搬出去，跟你住船长室。」', to: 'a2_ma_night',
      effect: { rel: { liu: +1 }, standing: +6, body: -4,
                flags: { asked_captain_room: true }, tone: 'risk' } }
  ]
},

/* ═══════════════════ 马玉超 ═══════════════════ */

a2_ma_night: {
  id: 'a2_ma_night', act: '第二幕', place: '十二人间 · 下铺', date: '2011 年 7 月 20 日 夜',
  mood: 'blood', ambience: 'quiet', day: 206,
  text: [
    '那天晚上，马玉超睡在你下铺。他翻来覆去，没睡。',
    '屋子外面有人在走，来回走。',
    '他忽然开口，声音很小：',
    { t: '「我不敢一个人住。」', cls: 'q' },
    '你说，我在这儿。',
    '他说，不是这个意思。',
    { t: '他没再解释。你也没有再问。', cls: 'inner' }
  ],
  choices: [
    { label: '「那你过来，睡我这边。」', to: 'a2_magone',
      effect: { rel: { ma: +4 }, body: -4, flags: { shared_bunk: true } } },
    { label: '「你要是想走，我陪你一起。」', to: 'a2_magone',
      effect: { rel: { ma: +3 }, body: -6, flags: { offered_to_leave: true } } },
    { label: '装作睡着了。', to: 'a2_magone',
      effect: { body: -2, flags: { pretended_sleep: true } } }
  ]
},

a2_magone: {
  id: 'a2_magone', act: '第二幕', place: '十二人间', date: '2011 年 7 月 21 日 天亮',
  mood: 'blood', ambience: 'quiet', day: 207, img: 'img/emptybunk.jpg',
  text: [
    '天亮以后，马玉超就不见了。',
    '人是怎么没的，谁也不知道。他的东西一样都没少。',
    '可能他是直接游走了。',
    { t: '肯定死了。', cls: 'beat' },
    '刘贵夺知道马玉超不见了，就在船员面前说：',
    { t: '「他咋跳海了？没打算动他，他是我的人，是我的卧底。」', cls: 'q' },
    { t: '你们之前都不知道马玉超是卧底。到底是不是，谁也不清楚。', cls: 'inner' },
    '反正刘贵夺就这么说。他故意制造这种气氛。',
    '大家都害怕，一见到有人过来就紧张得不行，互相也不敢说话。',
    { t: '二副和轮机长，就是聚堆说话死的。', cls: 'inner' }
  ],
  choices: [
    { label: '把马玉超的日记本收起来。', to: 'a2_hide',
      effect: { flags: { has_ma_diary: true }, body: -5, standing: -2 } },
    { label: '什么都不做。', to: 'a2_hide',
      effect: { body: -3 } },
    { label: '去问刘贵夺，马玉超到底是不是卧底。', to: 'a2_hide',
      effect: { rel: { liu: -1 }, standing: -3, body: -6,
                flags: { asked_about_ma: true } } }
  ]
},

a2_hide: {
  id: 'a2_hide', act: '第二幕', place: '全船', date: '2011 年 7 月 21 日',
  mood: 'blood', ambience: 'engine', day: 207,
  imgSlot: '船底狭窄的水舱口，六角螺栓，一道缝。拍进去是一片黑。',
  text: [
    '其实你在渔船上四处查看过。你一心想找个地方藏起来。',
    '藏一个月半个月的，之后就到家了，就跑回去了。',
    '船底有个水舱，装淡水的，人可以进去。',
    { t: '可上面是螺丝拧上的。出水口入水口就那么大的口，你人进去了，盖不上。', cls: 'inner' },
    '船的夹板你也掀开过。里面填的是泡沫，太窄，爬不进去。',
    '救生筏让钢筋锁着，刀砍都砍不开。',
    '能漂浮的东西，全让他们收了。',
    '就算你抱着东西跳下去，也没有动力。游出去几百米，海流一冲就回来了。',
    { t: '船上就那么大点儿地方。真没处藏。', cls: 'beat' }
  ],
  choices: [
    { label: '不藏了。该干什么干什么。', to: 'a2_after',
      effect: { body: +2, standing: +2 } },
    { label: '把水舱的螺丝拧开一半，留个余地。', to: 'a2_after',
      effect: { body: -6, standing: -2, flags: { loosened_hatch: true } } },
    { label: '去找姜晓龙，把话挑明。', to: 'a2_after',
      effect: { body: -4, rel: { liu: -1 }, standing: +2 } },
    { label: '没有一点能藏的地方。那就走马玉超那条路。', to: 'e_ma',
      effect: { flags: { chose_the_sea: true }, body: -20 }, tone: 'risk' }
  ]
},

/* ── 夜航 B ── */
a2_after: {
  id: 'a2_after', act: '第二幕', place: '太平洋', date: '2011 年 7 月 22 日',
  mood: 'blood', ambience: 'sea', day: 209,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a2_cui' },
  text: [
    '现在撒尿一般都朝着船舷外边。',
    { t: '冷不丁推一把就下去了。那会儿撒尿都得先观察一阵。', cls: 'inner' },
    '刘贵夺自己也睡不好。他搬进了船长室，上床后得找两个人守着。',
    '他还找人监视你。表面说是看管机舱，怕货物毁坏机器什么的。',
    '你心里有数。他们就是看着你，怕你在饭里动手脚。',
    { t: '一直你就没想过他们会信任你。', cls: 'inner' }
  ]
},

a2_cui: {
  id: 'a2_cui', act: '第二幕', place: '后甲板', date: '2011 年 7 月 22 日',
  mood: 'blood', ambience: 'quiet', day: 210,
  text: [
    '有一天崔勇来找你。他跟你和刘贵夺、黄金波年龄差不多。',
    { t: '「你跟刘贵夺比较好，你帮我去劝劝他。」', cls: 'q' },
    { t: '「咱俩不行加入他们得了。如果真有那啥的话回去再说。」', cls: 'q' },
    { t: '「反正真有事儿的话，能往后靠就尽量往后靠。」', cls: 'q' },
    '崔勇平时很懒，想吃点啥不爱动弹就让你去给他做。刘贵夺多少有点看不惯，俩人吵过。',
    '崔勇因为这个害怕了。加入的事他说了好几回。',
    '一开始你不想去。之后寻思还是去吧——因为你心里也没底。'
  ],
  choices: [
    { label: '跟他一起去找姜晓龙。', to: 'a2_jiang',
      effect: { rel: { cui: +2 }, body: -4 } },
    { label: '「我不去。这事儿没法回头。」', to: 'a2_jiang',
      effect: { rel: { cui: -2 }, body: -2, flags: { refused_to_join: true } } },
    { label: '「要去你自己去。我什么都不说。」', to: 'a2_jiang',
      effect: { rel: { cui: -1 }, body: -3, standing: -2 } }
  ]
},

a2_jiang: {
  id: 'a2_jiang', act: '第二幕', place: '前甲板', date: '2011 年 7 月 22 日',
  mood: 'blood', ambience: 'quiet', day: 210,
  text: [
    '你们先找姜晓龙。就是杀老夏那个。',
    { t: '「最好别加入，这事儿没法回头。」', cls: 'q' },
    '完了他又说，他说了不算，得找刘贵夺。',
    '你们在外面喊了一声：「刘哥，你出来一下。」',
    '崔勇就说：',
    { t: '「刘哥，如果再有事儿的话你叫我们俩就行了，我们肯定跟你一块儿。」', cls: 'q' },
    '他说了半天，看起来挺紧张。你在一边坐着，啥也没说。',
    '刘贵夺不想让你俩加入：',
    { t: '「别加入，回家就行了。我们上日本还不一定有没有事儿，能回家尽量回家。」', cls: 'q' },
    '崔勇不放心，又说，刘哥，有事儿你记得叫我们。',
    { t: '「看看再说吧，应该没有什么事儿。」', cls: 'q' },
    '刘贵夺最终也没说行不行，转身走了。'
  ],
  choices: [
    { label: '你追上刘贵夺，问他一句为什么。', to: 'a2_money',
      effect: { rel: { liu: +2 }, body: -4, flags: { asked_liu_why: true } } },
    { label: '什么也没说，跟他回去。', to: 'a2_money',
      effect: { body: -2 } },
    { label: '你留在甲板上，跟姜晓龙多聊一会儿。', to: 'a2_money',
      effect: { rel: { cui: +1 }, body: -3, flags: { talked_jiang: true } } }
  ]
},

/* ═══════════════════ 内斗：要钱 ═══════════════════ */

a2_money: {
  id: 'a2_money', act: '第二幕', place: '船长室', date: '2011 年 7 月 23 日',
  mood: 'blood', ambience: 'sea-tense', day: 211,
  imgSlot: '船长室里，船员排着队打电话。卫星电话、纸和笔、一张张脸。',
  text: [
    '刘贵夺想偷渡日本。他告诉船员，日本有个朋友，能帮忙办假证。',
    '办证要钱。他开始让所有人给家里打电话。',
    { t: '「就说你要用钱，别说别的。」', cls: 'q' },
    '钱打到卡上，卡得交给刘贵夺。',
    '有个叫韩俐的，家里实在拿不出来。他说他没办法。',
    { t: '后来他就不在了。', cls: 'beat' },
    '你的电话也打了。你妈问你在那边好不好，你说好。'
  ],
  choices: [
    { label: '让你妈把钱打过来。', to: 'a2_huang',
      effect: { body: -6, standing: +4, flags: { family_sent_money: true } } },
    { label: '跟你妈说没事，别打钱。', to: 'a2_huang',
      effect: { body: -3, standing: -6, flags: { refused_money: true } },
      tone: 'risk' },
    { label: '把卡交上去，但留了个心眼，报了个假数。', to: 'a2_huang',
      effect: { standing: +2, body: -8, flags: { lied_about_money: true },
                tone: 'risk' } }
  ]
},

a2_huang: {
  id: 'a2_huang', act: '第二幕', place: '甲板', date: '2011 年 7 月 24 日',
  mood: 'blood', ambience: 'sea-tense', day: 212,
  text: [
    '黄金波来找刘贵夺，说包德他们要造反。',
    '包德是内蒙古人，块头大，那一伙里有好几个内蒙的。',
    '他们说话用蒙古语，别人听不懂。这一点让刘贵夺很不安。',
    '刘贵夺听完，叫人把崔勇和你都喊过去。',
    { t: '「今天晚上，你们俩动手。」', cls: 'q' },
    '崔勇脸白了。你看着他，他也看着你。'
  ],
  choices: [
    { label: '「我不动手。你叫别人。」', to: 'a2_before',
      effect: { standing: -8, rel: { liu: -2 }, body: -5,
                flags: { refused_to_kill_baode: true }, tone: 'risk' } },
    { label: '「好。」', to: 'a2_before',
      effect: { standing: +8, rel: { liu: +2 }, body: -8,
                flags: { agreed_to_kill: true }, tone: 'risk' } },
    { label: '「我可以看着，不动手。」', to: 'a2_before',
      effect: { standing: +2, body: -6, flags: { watched_kill: true },
                tone: 'risk' } }
  ]
},

/* ── 夜航 C ── */
a2_before: {
  id: 'a2_before', act: '第二幕', place: '太平洋', date: '2011 年 7 月 24 日 傍晚',
  mood: 'blood', ambience: 'sea-tense', day: 212,
  onEnter: { body: +12, standing: +3 },
  night: { pool: 'act2', draws: 1, then: 'a2_baode' },
  text: [
    '那天下午的海是平的。平得像什么都没发生过。',
    '你把鱼刀磨了一遍。你不知道自己在磨什么。',
    '崔勇在你旁边坐着，一句话也不说。',
    '太阳下去之后，船上安静得不像话。'
  ]
},

a2_baode: {
  id: 'a2_baode', act: '第二幕', place: '机舱 · 甲板', date: '2011 年 7 月 24 日 夜',
  mood: 'blood', ambience: 'sea-tense', day: 212, img: 'img/smear.jpg',
  text: [
    '包德被叫到机舱。他一进去就知道不对了。',
    '他扑上来抢刀，手上被划开一道。他退到船边。',
    { t: '「刘哥！你放过我吧。」', cls: 'q' },
    '刘贵夺站在楼梯上，没有下去。',
    { t: '「别捅了。你俩绑起来，扔下去得了。」', cls: 'q' },
    '包德跳了海。他跳之前回头看了一眼。',
    '崔勇不肯捅。刘贵夺把刀塞进他手里，按着他的手。',
    { t: '「你手上也得沾沾血。」', cls: 'q' },
    '崔勇把手伸进包德留下的那摊血里，然后抹在了自己脸上。',
    { t: '「我沾血了，我沾血了！」', cls: 'shout' },
    '他喊得很响。你知道他为什么喊——不沾血的人，活不到岸上。'
  ],
  choices: [
    { label: '把脸转开。', to: 'a2_noodle',
      effect: { body: -4, flags: { turned_away: true } } },
    { label: '看着崔勇，不让他一个人喊。', to: 'a2_noodle',
      effect: { rel: { cui: +3 }, body: -6, standing: +2 } },
    { label: '你也把手伸进那摊血里。', to: 'a2_noodle',
      effect: { blood: +1, standing: +12, body: -8,
                flags: { smeared_blood: true }, tone: 'risk' } }
  ]
},

a2_noodle: {
  id: 'a2_noodle', act: '第二幕', place: '全船', date: '2011 年 7 月 25 日 凌晨',
  mood: 'blood', ambience: 'sea-tense', day: 213, imgSlot: '船上的高音喇叭，锈铁杆上挂着，天还没亮。只拍喇叭和天。',
  text: [
    '后半夜，船上的高音喇叭响了。',
    '那是刘贵夺在船长室里按的。',
    { t: '「单国喜，出来！」', cls: 'shout' },
    '喇叭里的声音在整个海面上滚了一遍。',
    '没有人应。',
    { t: '「单国喜，出来！」', cls: 'shout' },
    '过了一会儿，单国喜从舱里出来了。他走得很慢。',
    '他走到舵楼底下，抬头看了一眼。',
    { t: '之后就没有他的声音了。', cls: 'beat' }
  ],
  choices: [
    { label: '你把被子蒙在头上。', to: 'a2_deep',
      effect: { body: -6, standing: -2 } },
    { label: '你起来，站在舱门口。', to: 'a2_deep',
      effect: { body: -8, standing: +4, flags: { stood_at_door: true } } },
    { label: '你去找姜晓龙，问他下一个是谁。', to: 'a2_deep',
      effect: { rel: { liu: -1 }, body: -5, standing: +2,
                flags: { asked_who_next: true } } }
  ]
},

/* ── 夜航 D：最后一夜 ── */
a2_deep: {
  id: 'a2_deep', act: '第二幕', place: '太平洋 · 日本以东', date: '2011 年 7 月 25 日',
  mood: 'blood', ambience: 'sea-tense', day: 213,
  onEnter: { body: +16, standing: +4 },
  night: { pool: 'act2', draws: 2, then: 'a3_valve' },
  text: [
    '天快亮的时候，你听见船底有水声。',
    '不是浪。是那种水自己在往一个地方灌的声音。',
    { t: '你是学轮机的。你知道那意味着什么。', cls: 'inner' },
    '你下床的时候，脚底下已经有点凉了。'
  ]
}

  });
})();
