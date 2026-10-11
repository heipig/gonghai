/* ═══════════════════════════════════════════════════════════════
   《公海》storylet 池（QBN）
   ─────────────────────────────────────────────────────────────
   这些不是主线，是「夜里有人来找你」。
   每一段都有解锁条件，条件由玩家状态表达。

   关键设计：**沾过血的人和没沾血的人，看到的是两条船。**
   act2 池里有专供 bloodMax:0 的段（还有人拿你当人），
   也有只在 bloodMin:1 之后才出现的段（你已经开始听懂他们的话）。

   写作原则：一个 storylet 最多三行，一行一句话。

   素材同主线，全部取自庭审记录与《时尚先生》亲历者自述。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  var E = window.GH.Engine;

  E.register({

/* ═══════════════════════════════════════════════════════════════
   act1 —— 去秘鲁的路上，和钓鱿鱼的几个月
   这一段你还是个人。手上的事还没开始。
   ═══════════════════════════════════════════════════════════════ */

s_dice: {
  id: 's_dice', storylet: true, pool: 'act1', weight: 2,
  act: '夜', place: '十二人间', mood: 'calm', ambience: 'sea',
  imgSlot: '十二人间里围着一盏灯推牌九，一堆皱钞票。看不清脸。',
  text: [
    '他们天天推牌九，赌得还不小。',
    '崔勇把你的钱借走了两三千，都输在牌桌上。',
    '你不爱借，可你也不爱说。'
  ],
  choices: [
    { label: '「这钱你什么时候还。」', effect: { rel: { cui: -1 }, body: +2 } },
    { label: '算了。反正船上也没处花。', effect: { rel: { cui: +2 }, smokes: 1 } },
    { label: '坐下玩两把。', effect: { body: -4, smokes: -1, standing: +2 } }
  ]
},

s_liu_help: {
  id: 's_liu_help', storylet: true, pool: 'act1', weight: 2,
  act: '夜', place: '舱底', mood: 'calm', ambience: 'engine',
  text: [
    '卸货的时候，你个头矮，举不上去。',
    '刘贵夺一般都不让你下舱。你一共下去过一两次，都是他帮你举。',
    '他身体不算壮，甚至有点瘦。'
  ],
  choices: [
    { label: '「谢了，刘哥。」', effect: { rel: { liu: +2 }, standing: +1 } },
    { label: '「我自己能行。」', effect: { rel: { liu: -1 }, body: -4 } },
    { label: '什么也不说，把烟递过去。', effect: { rel: { liu: +1 }, smokes: -1 } }
  ]
},

s_liu_best: {
  id: 's_liu_best', storylet: true, pool: 'act1', weight: 1,
  act: '夜', place: '钓鱿甲板', mood: 'calm', ambience: 'sea',
  text: [
    '有一个月，刘贵夺钓了 13000 多斤。',
    '你的钩修得整整齐齐，他的钩歪了也不弄。',
    '他记性好，账也算得快。'
  ],
  choices: [
    { label: '问他怎么钓的。', effect: { rel: { liu: +2 }, body: -4 } },
    { label: '离他远一点。这人总在琢磨事。', effect: { rel: { liu: -1 }, body: +2 } }
  ]
},

s_xiang: {
  id: 's_xiang', storylet: true, pool: 'act1', weight: 1,
  act: '夜', place: '食堂', mood: 'tense', ambience: 'quiet',
  text: [
    '项立山头发全白了，五十多岁。',
    '他说他以前弄死过人，打过两回劳改。',
    '后来查出来，那两次都是盗窃。'
  ],
  choices: [
    { label: '「项叔，你少说这些。」', effect: { rel: { zhao: +1 }, body: -2 } },
    { label: '听着，不接话。', effect: { body: -3, flags: { heard_xiang_boast: true } } }
  ]
},

s_wen_brothers: {
  id: 's_wen_brothers', storylet: true, pool: 'act1', weight: 2,
  act: '夜', place: '机舱四人间', mood: 'calm', ambience: 'engine',
  text: [
    '轮机长温斗和温密是叔伯兄弟，住一个四人间。',
    '温斗管机器，管得很好。',
    '船上的人多半是熟人互相叫来的。'
  ],
  choices: [
    { label: '跟温斗聊两句机器。', effect: { body: -2, standing: +2, flags: { knew_wendou: true } } },
    { label: '点头就走。', effect: { body: +1 } }
  ]
},

s_wangpeng: {
  id: 's_wangpeng', storylet: true, pool: 'act1', weight: 1,
  act: '夜', place: '前甲板', mood: 'calm', ambience: 'sea',
  text: [
    '王鹏 25 岁，是温斗学驾驶时候的师弟。',
    '温斗叫他来，他家人反对。',
    '他说到外面闯一闯。'
  ],
  choices: [
    { label: '「你家里人知道你来吗。」', effect: { body: -2, flags: { asked_wangpeng: true } } },
    { label: '跟他一起抽烟。', effect: { smokes: -1, body: +2, standing: +1 } }
  ]
},

s_ma_diary: {
  id: 's_ma_diary', storylet: true, pool: 'act1', weight: 3,
  act: '夜', place: '寝室下铺', mood: 'calm', ambience: 'quiet',
  require: { rel: { ma: { min: 1 } }, why: '他还不怎么跟你说话。' },
  text: [
    '马玉超在写日记。他说他从小就爱写东西。',
    '他念了一段给你听，有点像诗。',
    '他说等回去了想考个编制。'
  ],
  choices: [
    { label: '「你写吧。我不告诉别人。」', effect: { rel: { ma: +3 }, body: -2 } },
    { label: '「这东西别让人看见。」', effect: { rel: { ma: +2 }, body: -3, flags: { warned_ma: true } } },
    { label: '「考编也不是那么容易。」', effect: { rel: { ma: -1 }, body: +2 } }
  ]
},

s_jiang_kneel: {
  id: 's_jiang_kneel', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '夜', place: '食堂', mood: 'tense', ambience: 'quiet',
  imgSlot: '食堂里一个人跪在地上，另一个人站着。只拍背影和手。',
  text: [
    '出事以前有天晚上，老夏喝了酒，骂姜晓龙。',
    '姜晓龙拿刀去扎他，没扎着。',
    '船长给姜晓龙几巴掌，要撵他走。姜晓龙当场给船长跪下了。'
  ],
  choices: [
    { label: '上去替他说句话。', effect: { rel: { liu: +1 }, standing: -3, body: -4,
      flags: { spoke_for_jiang: true } } },
    { label: '看着。这跟你没关系。', effect: { body: -2 } }
  ]
},

s_seasick: {
  id: 's_seasick', storylet: true, pool: 'act1', weight: 2, once: true,
  act: '夜', place: '铺上', mood: 'calm', ambience: 'sea',
  text: [
    '你一直吐，一天吐好几回。',
    '有人给你递了个塑料袋，什么都没说。',
    '第十六天，忽然就好了。'
  ],
  choices: [
    { label: '把塑料袋还回去，说声谢。', effect: { standing: +2, body: +4 } },
    { label: '躺着，等它过去。', effect: { body: -3 } }
  ]
},

s_fish_night: {
  id: 's_fish_night', storylet: true, pool: 'act1', weight: 1,
  act: '夜', place: '船尾', mood: 'calm', ambience: 'deep',
  text: [
    '没有月亮的夜里，海是黑的，什么都看不见。',
    '远处别的渔船亮着灯，星星点点。',
    '那些光让你觉得这条船是被围着的。'
  ],
  choices: [
    { label: '在船尾站很久。', effect: { body: -2, flags: { stared_at_sea: true } } },
    { label: '回舱睡觉。明天还要钓鱼。', effect: { body: +5 } }
  ]
},

/* ═══════════════════════════════════════════════════════════════
   act2 —— 劫船之后。这一段开始分化：
   bloodMax 0 的段是「还有人拿你当人」，
   bloodMin 1 的段是「你已经听得懂他们的话了」。
   ═══════════════════════════════════════════════════════════════ */

s_clean_hands: {
  id: 's_clean_hands', storylet: true, pool: 'act2', weight: 3,
  require: { bloodMax: 0, why: '你的手已经不干净了。' },
  act: '夜', place: '后甲板', mood: 'tense', ambience: 'sea',
  text: [
    '姜晓龙从前面回来，跟你唠嗑。',
    { t: '「心理压力别太大，没想动你，不能动你，咱们都是朋友。」', cls: 'q' },
    { t: '「我不一定哪天也下海里去了，能帮上忙我肯定帮一把。」', cls: 'q' }
  ],
  choices: [
    { label: '「你们啥时候杀我，提前告诉我一声。我自己跳。」',
      effect: { standing: +2, body: -6, flags: { said_ill_jump: true } } },
    { label: '点头，说声谢。', effect: { body: -3, rel: { liu: +1 } } },
    { label: '什么都不说。你不信他。', effect: { body: -2, standing: -2 } }
  ]
},

s_no_sleep: {
  id: 's_no_sleep', storylet: true, pool: 'act2', weight: 3,
  act: '夜', place: '寝室', mood: 'blood', ambience: 'deep',
  text: [
    '你已经几天不敢睡了，每天最多睡一个小时。',
    '门那边挂着一条大棉被，挡住外面的光。',
    '你躺着听声音。船一直在走。'
  ],
  choices: [
    { label: '睁着眼，听一整夜。', effect: { body: -10, standing: -1 } },
    { label: '把铺盖搬到人多的舱里去睡。', effect: { body: -4, standing: +2 } },
    { label: '强迫自己闭眼。明天还要做饭。', effect: { body: +6, flags: { forced_sleep: true } } }
  ]
},

s_huang_dream: {
  id: 's_huang_dream', storylet: true, pool: 'act2', weight: 2,
  require: { rel: { huang: { min: 0 } }, why: '你们不熟。' },
  act: '夜', place: '二层甲板', mood: 'tense', ambience: 'quiet',
  text: [
    '黄金波 19 岁，牙克石人，看起来还是个小孩。',
    '他说他在北京有家有车有房，但从小有个海员梦。',
    '他上船之后学会了抽烟，刘贵夺把自己的烟给他，也没提过钱的事。'
  ],
  choices: [
    { label: '「你手怎么老抖。」', effect: { rel: { huang: +2 }, body: -3,
      flags: { noticed_huang_hands: true } } },
    { label: '给他递根烟。', effect: { rel: { huang: +2 }, smokes: -1 } },
    { label: '走开。他跟着刘贵夺。', effect: { rel: { huang: -1 }, body: +2 } }
  ]
},

s_blood_list: {
  id: 's_blood_list', storylet: true, pool: 'act2', weight: 2,
  require: { bloodMin: 1, why: '你还没资格知道这些。' },
  act: '夜', place: '船长室', mood: 'blood', ambience: 'deep',
  text: [
    '刘贵夺在船长室写了张纸条：四个名字。',
    '让同伙一个个传着看。',
    '纸条最后传到你手上。'
  ],
  choices: [
    { label: '看完，递给下一个人。', effect: { body: -8, standing: +4 } },
    { label: '记住这四个名字。', effect: { body: -6, flags: { knows_list: true }, standing: +2 } },
    { label: '「我不看这个。」', effect: { rel: { liu: -2 }, standing: -4, body: -5 } }
  ]
},

s_rehearse: {
  id: 's_rehearse', storylet: true, pool: 'act2', weight: 2,
  require: { bloodMin: 1, why: '他们还没让你一起对口径。' },
  act: '夜', place: '食堂', mood: 'blood', ambience: 'quiet',
  text: [
    '他们在对口径。一遍一遍地对。',
    '包德一伙是坏人，先跑的四个是坏人。',
    '剩下的十一个人是被劫持的好人。'
  ],
  choices: [
    { label: '跟着背下来。', effect: { standing: +6, body: -5, flags: { knows_cover: true } } },
    { label: '点头，但一个字也不记。', effect: { body: -3 } }
  ]
},

s_liu_family: {
  id: 's_liu_family', storylet: true, pool: 'act2', weight: 2,
  require: { rel: { liu: { min: 2 } }, why: '他不会跟你说这些。' },
  act: '夜', place: '船尾', mood: 'calm', ambience: 'deep',
  text: [
    '刘贵夺说他家里人叫他小二。',
    '他家在黑龙江种地。十五岁那年村里大旱，他第一次离家。',
    '决定上船那天，他爸开拖拉机送他到县城。他买了两包香烟塞给他爸。'
  ],
  choices: [
    { label: '「你后悔辍学早吧。」', effect: { rel: { liu: +2 }, body: -3,
      flags: { knew_liu_regret: true } } },
    { label: '听着，什么也不说。', effect: { rel: { liu: +1 }, body: -2 } }
  ]
},

s_the_others: {
  id: 's_the_others', storylet: true, pool: 'act2', weight: 2,
  act: '夜', place: '甲板', mood: 'blood', ambience: 'deep',
  text: [
    '甲板上有人在洗地。洗得很干净。',
    '那阵儿有人说：那家伙装逼。',
    '说的是老夏。'
  ],
  choices: [
    { label: '跟着笑了一声。', effect: { standing: +3, body: -3,
      flags: { laughed_at_xia: true } } },
    { label: '转身走开。', effect: { standing: -2, body: -4 } }
  ]
},

s_smoke_currency: {
  id: 's_smoke_currency', storylet: true, pool: 'act2', weight: 2,
  act: '夜', place: '寝室', mood: 'tense', ambience: 'quiet',
  text: [
    '往回拖的路上，烟成了硬通货。',
    '一条烟能换一次值班，或者换别人闭嘴。',
    '你的烟不多了。'
  ],
  choices: [
    { label: '拿烟换一次不值班。', effect: { smokes: -1, body: +8 } },
    { label: '把烟收好。以后更用得着。', effect: { body: -3 } },
    { label: '把烟分给同屋的人。', effect: { smokes: -2, standing: +6, rel: { zhao: +2 } } }
  ]
},

/* ═══════════════════════════════════════════════════════════════
   act3 —— 木筏、台风、等待
   ═══════════════════════════════════════════════════════════════ */

s_pirate: {
  id: 's_pirate', storylet: true, pool: 'act3', weight: 2,
  act: '夜', place: '海上', mood: 'tense', ambience: 'deep',
  text: [
    '往回跑的路上，真的什么都没有，就是海。',
    '只有一次停下来换机油滤芯，远远看到一艘船。',
    '没有国旗，没有船号，二十多分钟后开走了。'
  ],
  choices: [
    { label: '一直盯着它，直到它消失。', effect: { body: -5, flags: { saw_pirate: true } } },
    { label: '回舱里去。', effect: { body: -2 } }
  ]
},

s_typhoon: {
  id: 's_typhoon', storylet: true, pool: 'act3', weight: 3,
  act: '夜', place: '海上', mood: 'blood', ambience: 'wind',
  imgSlot: '台风天的甲板，浪打上来，能见度极低，船在倾。没有人。',
  text: [
    '台风梅花正席卷西太平洋。',
    '船动不了，只能等。',
    '你不知道救援船会不会来，也不知道它来的时候，你还活着没有。'
  ],
  choices: [
    { label: '把救生衣找出来，放在床边。', effect: { body: -4, standing: -3,
      flags: { kept_lifevest: true } } },
    { label: '躺着，等它过去。', effect: { body: -8 } },
    { label: '去厨房，给大家做点热的。', effect: { body: -6, standing: +6 } }
  ]
},

s_fish: {
  id: 's_fish', storylet: true, pool: 'act3', weight: 2,
  act: '夜', place: '甲板', mood: 'tense', ambience: 'quiet',
  text: [
    '有人在算还剩几个人。',
    '33 个人出海。现在数得过来的，没几个了。',
    '有人说了一句：要是船上的人都能像鱼一样游泳就好了。'
  ],
  choices: [
    { label: '把这句话记住。', effect: { body: -4, flags: { heard_fish_line: true } } },
    { label: '「别说了。」', effect: { standing: -3, body: -3 } }
  ]
},

s_note: {
  id: 's_note', storylet: true, pool: 'act3', weight: 2,
  act: '夜', place: '船长室', mood: 'blood', ambience: 'quiet',
  require: { bloodMin: 1, why: '他们不会让你参与这个。' },
  text: [
    '他们在写那张纸条。编的话要经得起问。',
    '写了一遍，撕了，又写一遍。',
    '纸条最后要交到每个人手里，各自背熟。'
  ],
  choices: [
    { label: '把纸条上的字一个一个记住。', effect: { body: -6, standing: +3,
      flags: { memorized_note: true } } },
    { label: '「这写得不对。第一个死的是老夏。」', effect: { standing: -6, body: -8,
      rel: { liu: -2 }, flags: { challenged_note: true } }, tone: 'risk' }
  ]
},

s_home_call: {
  id: 's_home_call', storylet: true, pool: 'act3', weight: 2,
  act: '夜', place: '船尾', mood: 'calm', ambience: 'deep',
  text: [
    '卫星电话二十块钱一分钟。',
    '有人在电话里说阑尾炎，说住院花了四千九。',
    '轮到你的时候，刘贵夺看了你一眼，说：打吧。'
  ],
  choices: [
    { label: '打给妈，说「过段时间就回去了」。', effect: { body: -5,
      flags: { told_truth_home: true } } },
    { label: '按他们说的要钱。', effect: { standing: +5, body: -8,
      flags: { called_home: true } } },
    { label: '把电话还回去。不打。', effect: { standing: -5, body: -4,
      flags: { refused_call: true } } }
  ]
}

  });
})();
