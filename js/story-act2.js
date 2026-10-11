/* ═══════════════════════════════════════════════════════════════
   《公海》第二幕 · 归航
   疑心 → 沾血要求 → 索钱 → 剿灭管理层 → 内讧之夜
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var A = '第二幕 · 归航';

  window.GH.Engine.register({

/* ── 夜航节点：第一幕收尾 ──────────────────────────────── */

n_act1: {
  id: 'n_act1', act: A, date: '2011 年 6 月下旬', place: '鲁荣渔 7451 · 归航途中',
  mood: 'tense', ambience: 'engine',
  onEnter: { body: +7, standing: +3 },
  night: { pool: 'act1', draws: 3, then: 'a2_trust' },
  text: [
    '船往东走，绕夏威夷，再一路往西。',
    '顺利的话，五十天到中国。',
    '第一个晚上没人睡。第二个晚上开始，日子又变回了日子——干活，吃饭，值班，打牌。',
    '只是夜里，总有人来找你。'
  ]
},

a2_trust: {
  id: 'a2_trust', act: A, day: 182, date: '2011 年 6 月下旬', place: '鲁荣渔 7451 · 过道',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '老周死了二十多天。贺松没再跟你说过一句话。',
    '他跟他那伙人聚在一堆，说这说那，还不许别人说悄悄话。',
    '他从你身边走过去的时候，你听见他在跟周满说：',
    { t: '「那几个又在后边捅咕。不敢大声，怕让人听见。」', cls: 'q' },
    '其实没什么。他们都是船长叫上船的大连老乡，本来关系就好，总在一块。',
    '但贺松的疑心是真的。他疑心的不是具体的人，是"有人在说话而我不知道"。',
    '这几天船的油耗比平时多了好几倍，辅机也少了几个。贺松天天骂：到底咋回事。'
  ],
  choices: [
    { label: '去查油耗。看看到底是谁在动机器。',
      to: 'n_act2a',
      effect: { body: -8, standing: +5, flags: { investigated_engine: true } } },
    { label: '跟贺松说：你别疑心了，这么下去先乱的是你自己。',
      to: 'n_act2a',
      effect: { rel: { he: -1 }, standing: -3, body: -2, flags: { warned_he_paranoia: true } } },
    { label: '什么都不做。疑心是别人的病。',
      to: 'n_act2a',
      effect: { body: +3, standing: -6, flags: { let_paranoia_run: true } } },
    { label: '去告诉船长：贺松在疑心你们。',
      to: 'n_act2a',
      effect: { rel: { captain: +3, he: -3 }, standing: -8, flags: { double_agent: true } },
      tone: 'risk' }
  ]
},

n_act2a: {
  id: 'n_act2a', act: A, date: '2011 年 6 月底', place: '鲁荣渔 7451 · 夜',
  mood: 'tense', ambience: 'sea-tense',
  onEnter: { body: +7, standing: +3 },
  night: { pool: 'act2', draws: 2, then: 'a2_demand' },
  text: [
    '这天晚上，贺松让周满来叫你。',
    '他说，松哥在船长室等你。',
    '你走过去的那几步，甲板上没有一个人看你。他们都低着头。'
  ]
},

/* ── 核心抉择二：沾血 ─────────────────────────────────── */

a2_demand: {
  id: 'a2_demand', act: A, day: 190, date: '2011 年 7 月初', place: '鲁荣渔 7451 · 船长室',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '船长室里只有一盏灯。贺松坐在床边，看起来很累。',
    '他让你坐。你没坐。',
    { t: '「我手上有七八条人命了。」他说，「剩下的人想活命，得沾点血。」', cls: 'q' },
    '他说的"剩下的人"，是你。',
    { t: '「你手上是干净的。你猜回去以后，警察先信谁？」', cls: 'q' },
    '他从枕头底下拿出一把鱼刀，放在你面前的桌上，刀柄朝你。',
    { t: '「机舱四人间那个姓田的。你去。办完了，你跟我们是一伙的。办不完，」他停了一下，「我也没办法。」', cls: 'q' },
    '灯在晃。刀在桌上，一动不动。',
    { t: '你想起上船前的那个夏天。你想不起来那天下没下雨。', cls: 'inner' }
  ],
  choices: [
    { label: '把刀拿起来。去机舱四人间。',
      to: 'n_act2b',
      effect: { blood: +1, kills: +1, standing: +16, rel: { he: +3 }, body: -12,
                flags: { killed_tian: true } },
      tone: 'blood' },
    { label: '「我去。但我只按住他。刀让别人拿。」',
      to: 'n_act2b',
      effect: { blood: +1, kills: 0, standing: +7, rel: { he: +1 }, body: -14,
                flags: { held_him_down: true } },
      tone: 'blood' },
    { label: '「松哥，我去替你盯着别人。刀我不碰。」',
      to: 'n_act2b',
      effect: { standing: +12, rel: { he: +1 }, body: -8, flags: { stayed_clean_by_watching: true } },
      require: { rel: { he: { min: 2 } }, why: '他不信你。这句话得他先信你才说得出口。' } },
    { label: '「我不干。」',
      to: 'n_act2b',
      effect: { standing: -11, rel: { he: -3 }, body: -14, flags: { refused_blood: true } },
      tone: 'risk' }
  ]
},

n_act2b: {
  id: 'n_act2b', act: A, date: '2011 年 7 月', place: '鲁荣渔 7451 · 夜',
  mood: 'blood', ambience: 'sea-tense',
  onEnter: { body: +7, standing: +3 },
  night: { pool: 'act2', draws: 2, then: 'a2_money' },
  text: [
    '那天之后，船上的人看你的眼神变了。',
    '有些人开始跟你说话。有些人开始不跟你说话。',
    '你分不清哪一种更糟。'
  ]
},

/* ── 索钱 ─────────────────────────────────────────────── */

a2_money: {
  id: 'a2_money', act: A, day: 205, date: '2011 年 7 月中旬', place: '鲁荣渔 7451 · 甲板',
  mood: 'tense', ambience: 'sea-tense',
  text: [
    '临近中午，贺松把全体船员叫到甲板上。',
    { t: '「去日本要钱。你们每人假装生病，用卫星电话给家里要五千块，打到一个邮政卡上。」', cls: 'q' },
    '甲板上没人说话。',
    '五千块。船上大部分人家里拿不出五千块。你自己家里也拿不出。',
    '曲志刚先开口了：',
    { t: '「我家里真没钱，打不了。」', cls: 'q' },
    '贺松让他多少打点。两个人吵了一架。',
    '你忽然明白：这个电话不是要钱。是在看谁听话，谁不听话。'
  ],
  choices: [
    { label: '打给家里。说生病了，要五千。',
      to: 'n_act2c',
      effect: { standing: +6, body: -6, flags: { asked_family_money: true } } },
    { label: '打给家里，但小声说：别汇，我没事。',
      to: 'n_act2c',
      effect: { standing: -6, body: -3, flags: { warned_family: true } },
      tone: 'risk' },
    { label: '「我家里没人了。」不打。',
      to: 'n_act2c',
      effect: { standing: -10, body: -4, flags: { refused_money: true } } },
    { label: '打给家里，然后当着贺松的面把电话内容重复一遍。',
      to: 'n_act2c',
      effect: { standing: +10, rel: { he: +2 }, body: -8, flags: { performed_loyalty: true } } }
  ]
},

n_act2c: {
  id: 'n_act2c', act: A, date: '2011 年 7 月', place: '鲁荣渔 7451 · 深夜',
  mood: 'tense', ambience: 'sea-tense',
  onEnter: { body: +7, standing: +3 },
  night: { pool: 'act2', draws: 2, then: 'a2_purge' },
  text: [
    '这个电话把船上的东西搅动了。',
    '有人打完了回来蹲在甲板上哭。有人打完了一句话不说。',
    '当天下午，巴雅尔悄悄找了个内蒙古老乡，说了很久的话。',
    '当天晚上，贺松也找了人。',
    '两边都在找人。'
  ]
},

/* ── 核心抉择三：剿灭管理层 ───────────────────────────── */

a2_purge: {
  id: 'a2_purge', act: A, day: 216, date: '2011 年 7 月 20 日 · 夜', place: '鲁荣渔 7451 · 甲板',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '贺松认定管理层要动手了。他要先动手。',
    '名单上的人都被看管着：船长邵广海、大副孙立成、二副田志国、大管轮焦德发。',
    '他把一把刀递给你。',
    { t: '「机舱四人间那个姓田的。你去把他叫出来。」', cls: 'q' },
    '甲板上很暗，只有船尾一盏灯。有人在舷梯口守着，一共两个人。',
    '你接过刀的时候，发现自己的手没抖。这件事后来让你想了很久。',
    { t: '田志国四十七岁。上船前你跟他没说过三句话。他老婆给他缝的棉裤，膝盖上有一块补丁。', cls: 'inner' }
  ],
  choices: [
    { label: '去叫。叫出来就完事。',
      to: 'n_act2d',
      effect: { blood: +1, kills: +1, standing: +12, body: -10, flags: { called_tian_out: true } },
      tone: 'blood' },
    { label: '去叫。但在过道里用最快的速度跟他说一句话。',
      to: 'n_act2d',
      effect: { blood: +1, kills: +1, standing: -8, body: -14, rel: { captain: +2 },
                flags: { warned_him_too_late: true, tried_to_warn: true } },
      tone: 'blood' },
    { label: '去叫，但故意走错舱，拖到他有机会跑。',
      to: 'n_act2d',
      effect: { standing: -11, rel: { he: -3 }, body: -12,
                flags: { sabotaged_purge: true, saved_a_life: true } },
      tone: 'risk' },
    { label: '把刀还回去。「这个我不去。」',
      to: 'n_act2d',
      effect: { standing: -12, rel: { he: -4 }, body: -10, flags: { refused_purge: true } },
      tone: 'risk' }
  ]
},

n_act2d: {
  id: 'n_act2d', act: A, date: '2011 年 7 月 21 日', place: '鲁荣渔 7451 · 甲板',
  mood: 'blood', ambience: 'sea-tense',
  onEnter: { body: +7, standing: +3 },
  night: { pool: 'act2', draws: 2, then: 'a2_split' },
  text: [
    '那一夜之后，船上剩下的人不到二十个。',
    '甲板被冲过很多遍，但有些地方冲不干净。',
    '大勇来找过你一次。他脸上有血，没擦干净。他跟你说：',
    { t: '「我沾血了。我沾血了。」', cls: 'q' },
    '他说这话的时候在笑。你后来一直记得那个笑。'
  ]
},

/* ── 核心抉择四：内讧之夜 ─────────────────────────────── */

a2_split: {
  id: 'a2_split', act: A, day: 216, date: '2011 年 7 月 24 日 · 下午', place: '鲁荣渔 7451 · 底层寝室',
  mood: 'blood', ambience: 'sea-tense',
  text: [
    '巴雅尔找到你。他把你拉到没人的地方。',
    { t: '「贺松打算只带两三个黑龙江老乡去日本。剩下的全杀了。」', cls: 'q' },
    { t: '「你帮他杀了这么多人。你觉得他会不会留你？」', cls: 'q' },
    '内蒙人都已经集中到底层寝室住了。要是真动手，贺松不一定有把握。',
    '他在等你说话。',
    '你手里现在有一个人的命。可能更多。',
    { t: '你想起来贺松帮你在舱底举过两次盘子。你也想起来他昨天递给你刀的时候，眼睛里什么表情都没有。', cls: 'inner' }
  ],
  choices: [
    { label: '立刻去找贺松，把巴雅尔的话原样说一遍。',
      to: 'n_act2e',
      effect: { rel: { he: +4, bayaer: -5 }, standing: +14, body: -8,
                flags: { betrayed_bayaer: true, he_survives: true } },
      tone: 'blood' },
    { label: '答应巴雅尔。跟他一起干。',
      to: 'n_act2e',
      effect: { rel: { bayaer: +5, he: -5 }, standing: -10, body: -14,
                flags: { joined_bayaer: true, he_survives: false } },
      tone: 'blood' },
    { label: '「我不掺和。你们自己的事。」然后回舱锁门。',
      to: 'n_act2e',
      effect: { standing: -12, body: -6, flags: { sat_out_split: true, he_survives: true } } },
    { label: '把两个人的话分别说给对方听，让他们自己撞。',
      to: 'n_act2e',
      effect: { standing: -16, rel: { he: -2, bayaer: -2 }, body: -10,
                flags: { played_both_sides: true, he_survives: true } },
      tone: 'risk' }
  ]
},

n_act2e: {
  id: 'n_act2e', act: A, date: '2011 年 7 月 25 日 · 凌晨', place: '鲁荣渔 7451 · 甲板',
  mood: 'blood', ambience: 'sea-tense',
  onEnter: { body: +7, standing: +3 },
  night: { pool: 'act2', draws: 2, then: 'a3_valve' },
  text: [
    '那天夜里，喇叭响过。',
    '有人被叫出去。回来的人不齐。',
    '天快亮的时候，船上安静了。安静得能听见水从船壳上滑过去的声音。',
    '你数了数还剩多少人。',
    { t: '十一个。', cls: 'beat' }
  ]
}

  });
})();
