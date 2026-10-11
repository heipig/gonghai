/* ═══════════════════════════════════════════════════════════════
   《公海》第三幕  总阀 → 木筏 → 最后一个人 → 靠岸 → 判决
   2011 年 7 月 25 日 — 2015 年
   ─────────────────────────────────────────────────────────────
   九个结局。没有一种是「赢」——真实里活下来的 11 个人全部获刑。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  var E = window.GH.Engine;

  E.register({

/* ═══════════════════ 海底总阀 ═══════════════════ */

a3_valve: {
  id: 'a3_valve', act: '第三幕', place: '机舱', date: '2011 年 7 月 25 日 凌晨',
  mood: 'blood', ambience: 'deep', day: 212, img: 'img/valve.jpg',
  text: [
    '第二天早晨有人喊：找大管轮王延龙，找不着了。',
    '接着喊：船坏了，海底总阀被人打开了。',
    '只有王延龙和轮机长温斗知道总阀在哪儿。温斗已经死了。'
  ],
  choices: [
    { label: '下机舱去看。水进得挺快。', to: 'a3_raft',
      effect: { body: -10, flags: { saw_valve: true } } },
    { label: '跟着大家拿所有能漂的东西，钉木筏。', to: 'a3_raft',
      effect: { body: -12, standing: +4 } },
    { label: '问刘贵夺：船会沉吗。', to: 'a3_raft',
      effect: { rel: { liu: +1 }, body: -6 } }
  ]
},

a3_raft: {
  id: 'a3_raft', act: '第三幕', place: '船尾', date: '2011 年 7 月 25 日',
  mood: 'blood', ambience: 'sea-tense', day: 212, img: 'img/raft.jpg',
  text: [
    '木筏扎好下了水。大副付义忠上了木筏。',
    '他一边笑一边冲你招手，说了好几遍：',
    { t: '「别吵吵，你上来。」', cls: 'q' },
    '筏上还有宋国春、宫学军、丁玉民，都穿好了救生衣。'
  ],
  choices: [
    { label: '上木筏。跟他们走。', to: 'e_raft',
      effect: { body: -6, flags: { boarded_raft: true } },
      tone: 'risk' },
    { label: '「没弄完，等会儿。」——你留在船上。', to: 'a3_iron',
      effect: { body: -4 } },
    { label: '喊：别走！船上还有人！', to: 'a3_iron',
      effect: { standing: -6, rel: { liu: -1 }, body: -5,
                flags: { shouted_after_raft: true } } }
  ]
},

a3_iron: {
  id: 'a3_iron', act: '第三幕', place: '船尾', date: '2011 年 7 月 25 日',
  mood: 'blood', ambience: 'sea-tense', day: 212,
  imgSlot: '一百多个钓鱿铁坠堆在甲板上，每颗拳头大，麻绳穿在一起。极冷的光。',
  text: [
    '不知是谁喊了一声：木筏怎么飘走了。',
    '大副捡起绳子，扔回了海里：「救生筏上藏了刀，他们还想杀人！我们不回去！」',
    '船不沉——货仓没东西，只是机舱进水。只能等救援。',
    '船长突然喊：「猫下、猫下。」木筏被海流冲回来了。'
  ],
  choices: [
    { label: '抓起铁坠，往海里扔。', to: 'a3_song',
      effect: { blood: +1, standing: +10, body: -14,
                flags: { threw_iron: true } },
      tone: 'blood' },
    { label: '下舱底把铁坠搬上来，但不下手。', to: 'a3_song',
      effect: { body: -12, standing: +4, flags: { fetched_iron: true } } },
    { label: '躲到舱里去。', to: 'a3_song',
      effect: { body: -4, standing: -6, flags: { hid_from_iron: true } } },
    { label: '把缆绳捡起来，往木筏上再扔一次。', to: 'a3_song',
      effect: { body: -8, standing: -8, rel: { liu: -2 },
                flags: { tried_tow_raft: true } }, tone: 'risk' }
  ]
},

a3_song: {
  id: 'a3_song', act: '第三幕', place: '船尾', date: '2011 年 7 月 25 日',
  mood: 'blood', ambience: 'sea-tense', day: 212,
  text: [
    '船长一喊「砸，往死里砸」，铁坠就往下扔。噗通噗通下去三个人。',
    '只剩丁玉民在上面。姜晓龙拿鱼叉跳上木筏。',
    '宋国春在海里离得近，一个劲儿求情：',
    { t: '「刘哥，你放过我吧，咱俩也没太大的仇，回去我也不能瞎说啊。」', cls: 'q' }
  ],
  choices: [
    { label: '把宋国春拉上来。', to: 'a3_verdict',
      effect: { body: -10, standing: -6, rel: { liu: -1 },
                flags: { saved_a_life: true } }, tone: 'risk' },
    { label: '站着，看着刘贵夺。等他发话。', to: 'a3_verdict',
      effect: { body: -8, flags: { waited_for_liu: true } } },
    { label: '转过头去。', to: 'a3_verdict',
      effect: { body: -6, standing: -2 } }
  ]
},

a3_verdict: {
  id: 'a3_verdict', act: '第三幕', place: '船尾', date: '2011 年 7 月 25 日',
  mood: 'blood', ambience: 'deep', day: 212,
  route: [
    { require: { bloodMin: 3 }, to: 'e_death' },
    { require: { flag: 'saved_a_life' }, to: 'a3_iron2' },
    { to: 'a3_iron2' }
  ],
  text: [ '船长走到刘贵夺跟前。' ]
},

/* 最后一道坎：船上还剩两个没沾血的人，其中一个就是你。 */
a3_iron2: {
  id: 'a3_iron2', act: '第三幕', place: '船尾', date: '2011 年 7 月 25 日',
  mood: 'blood', ambience: 'deep', day: 212,
  text: [
    '宋国春被拉上来了，脑袋在流血。你找了张纸巾给他擦。',
    '船长走到刘贵夺跟前，说：船上还有两个没沾血的。',
    { t: '「救援要来了，他俩还没沾血。」', cls: 'shout' }
  ],
  choices: [
    { label: '接过鱼刀。', to: 'a3_wait',
      effect: { blood: +1, standing: +8, body: -10, flags: { took_knife: true } },
      tone: 'blood' },
    { label: '「别捅了。绑起来扔下去得了。」', to: 'a3_wait',
      effect: { blood: +1, standing: +12, rel: { liu: +2 }, body: -14, kills: 0,
                flags: { gave_the_order: true } }, tone: 'blood' },
    { label: '「我不干。」', to: 'e_sunk',
      effect: { standing: -20, flags: { refused_final: true } }, tone: 'risk' },
    { label: '把救生衣脱给他，让他从船尾下水。往东游，别回头。', to: 'e_hero_escape',
      effect: { body: -12, rel: { liu: -3 }, flags: { freed_song: true } },
      require: { flag: 'saved_a_life', why: '你已经错过那个时机了。' },
      secret: true },
    { label: '下机舱，把总阀拧到底。谁都不用回去了。', to: 'e_valve',
      effect: { flags: { opened_valve: true } },
      require: { flag: 'saw_valve', why: '你根本不知道那个阀在哪儿。' },
      secret: true }
  ]
},

/* ═══════════════════ 等 ═══════════════════ */

a3_wait: {
  id: 'a3_wait', act: '第三幕', place: '海上', date: '2011 年 8 月',
  mood: 'blood', ambience: 'sea', day: 218,
  onEnter: { body: +18, standing: +4 },
  night: { pool: 'act3', draws: 3, then: 'a3_back' },
  text: [
    '台风梅花正席卷西太平洋。',
    '渔政的救援船赶来时，已经是七天之后。',
    '这七天里，船长李承权把你拉到一边，塞给你一张纸条。上面是编好的话。'
  ]
},

a3_back: {
  id: 'a3_back', act: '第三幕', place: '石岛码头', date: '2011 年 8 月 12 日',
  mood: 'blood', ambience: 'quiet', day: 229,
  imgSlot: '大雨里的石岛码头，一辆大巴、一辆救护车、二三十个人在岸上等着。武警的雨衣。',
  text: [
    '那天下着大雨。岸上停着一辆大巴车，还有救护车。',
    '二三十个人在那。武警把你们手反绑着押下去。',
    '大巴开出去没多远，警察不知从哪呼呼全冒了出来。'
  ],
  choices: [
    { label: '一个人一辆警车。带到派出所。', to: 'a3_trial',
      effect: { body: -6 } }
  ]
},

a3_trial: {
  id: 'a3_trial', act: '第三幕', place: '威海市中级人民法院', date: '2012 年 11 月',
  mood: 'blood', ambience: 'quiet', day: 300, img: 'img/court.jpg',
  text: [
    '审讯的人说：你说的这个，要是我跟你说，你自己会不会信？',
    '领导来了，说：人家都说了，第一个死的是夏琦勇，对不对？',
    '刘贵夺坐在前面。他的背后，另外十个被告坐成一排。'
  ],
  choices: [
    { label: '把口供撕了，说了。', to: 'a3_confess',
      effect: { flags: { confessed: true }, body: -8 } },
    { label: '按纸条上说。', to: 'a3_confess',
      effect: { flags: { stuck_to_story: true }, standing: -4 } }
  ]
},

a3_confess: {
  id: 'a3_confess', act: '第三幕', place: '法庭', date: '2012 年 11 月',
  mood: 'blood', ambience: 'quiet', day: 301,
  text: [
    '法官问刘贵夺，沾血是什么意思？',
    { t: '「你说是什么意思，这不是明摆着的吗？」', cls: 'q' },
    '法官要求他说明。他沉默了一下，抬起头。',
    { t: '「杀人的意思。」', cls: 'shout' },
    { t: '{{log}}', cls: 'log' }
  ],
  choices: [
    { label: '这是你走过的路。', to: 'a3_verdict2',
      effect: {} }
  ]
},

a3_verdict2: {
  id: 'a3_verdict2', act: '第三幕', place: '法庭', date: '2012 年 11 月 19 日',
  mood: 'blood', ambience: 'quiet', day: 302,
  route: [
    { require: { bloodMin: 3 }, to: 'e_death' },
    { require: { flag: 'saved_a_life' }, to: 'e_hero' },
    { require: { bloodMin: 1 }, to: 'e_four' },
    { to: 'e_four' }
  ],
  text: [ '宣判。' ]
},

/* ═══════════════════ 结局 ═══════════════════ */

e_body: {
  id: 'e_body', act: '结局', mood: 'calm',
  ending: {
    key: 'body', kind: '你没能撑到看见那条船', title: '力竭',
    body: [
      '你倒在钓鱿甲板上。灯还亮着，两千瓦，正对着你的脸。',
      '没有人停下手里的线。',
      { t: '海上常有的事。回去就说刮海里了，给鱼带下去了。', cls: 'q' },
      '——这句话是包宝成说的。后来他自己也被逼跳了海。'
    ]
  }
},

e_standing: {
  id: 'e_standing', act: '结局', mood: 'blood',
  ending: {
    key: 'standing', kind: '这条船上不再需要你', title: '叫名字',
    body: [
      '那天夜里，有人在门外叫你的名字。',
      '你出去了。',
      '甲板上没有一点血。他们连夜洗了。'
    ]
  }
},

e_ma: {
  id: 'e_ma', act: '结局', mood: 'calm', imgSlot: '空荡的上铺，被掀开的被子。没有人物。',
  ending: {
    key: 'ma', kind: '你和马玉超一样', title: '不敢一个人住',
    body: [
      '你趁天黑走到船舷边。没有救生衣，也没有能漂的东西——全被收走了。',
      '马玉超睡你下铺。头天晚上他说的是：',
      { t: '「我不敢一个人住。」', cls: 'q' },
      '天亮以后他就不见了。东西都没少。',
      '刘贵夺在船员面前说：他咋跳海了？没打算动他，他是我的人，是我的卧底。',
      '现在轮到你了。'
    ]
  }
},

e_valve: {
  id: 'e_valve', act: '结局', mood: 'blood', img: 'img/valve.jpg',
  ending: {
    key: 'valve', kind: '你把那个阀拧到了底', title: '海底总阀',
    body: [
      '海底总阀只有大管轮王延龙和轮机长温斗知道在哪儿。温斗死了。',
      '王延龙失踪之前，先把它拧开了。',
      '船不沉——货仓里没东西，水仓也没多少水。只是机舱进水，走不动了。',
      '于是这条船不得不发出求救信号。不得不回中国。',
      '你做了同样的事。你没能救任何人，你只是让这件事没有办法被忘掉。'
    ]
  }
},

e_raft: {
  id: 'e_raft', act: '结局', mood: 'blood', img: 'img/raft.jpg',
  ending: {
    key: 'raft', kind: '你上了那块木筏', title: '别吵吵，你上来',
    body: [
      '大副付义忠一边笑一边冲你招手，说了好几遍：别吵吵，你上来。',
      '木筏顺流漂出去十几米，缆绳断了。',
      '船长喊「猫下」。海流把你们又冲回了船边。',
      '铁坠是钓鱿鱼用的，一颗拳头大，一百多个。',
      '你在水里，三个人搂在一起。国产的救生衣一浸水，四五个小时就下沉。'
    ]
  }
},

e_sunk: {
  id: 'e_sunk', act: '结局', mood: 'blood',
  ending: {
    key: 'sunk', kind: '你被绑上铁坠', title: '沉',
    body: [
      { t: '「别捅了。你俩绑起来，扔下去得了。」', cls: 'q' },
      '有人脱了你的救生衣。手绑上了，腿绑没绑，你自己不记得了。',
      '有人用鱼线串了五六个铁坠，拴在你身上。',
      '你站的地方离船尾六七米。有人用了差不多五分钟，才把你推到没有栏杆的地方。',
      '他一直回头看刘贵夺，想着再给你一次机会。'
    ]
  }
},

e_hero_escape: {
  id: 'e_hero_escape', act: '结局', mood: 'calm',
  ending: {
    key: 'hero_escape', kind: '你把救生衣还给了他', title: '回去我也不能瞎说',
    body: [
      '你把救生衣穿回宋国春身上，把他推下了水。',
      '他回头看了你一眼，什么都没说。',
      '刘贵夺没有说话。那一眼之后，你在这条船上就只剩下一件事可做——等。',
      '七天后台风过去，渔政船到了。',
      '你活到了岸上。你手上没有血。你救过一个人。',
      '——这就是全部了。'
    ]
  }
},

e_hero: {
  id: 'e_hero', act: '结局', mood: 'calm',
  ending: {
    key: 'hero', kind: '你救过一个人', title: '有一个人记得你',
    body: [
      '宋国春的脑袋在流血，你找了张纸巾给他擦。',
      '然后你接过了刀。你沾了血。你活到了岸上。',
      '“鲁荣渔 2682 号”回来的 11 个人，全部获刑。',
      '有一个人记得你在船尾递过去的那张纸巾。',
      '在这个故事里，这就是最好的结局了。'
    ]
  }
},

e_death: {
  id: 'e_death', act: '结局', mood: 'blood', img: 'img/court.jpg',
  ending: {
    key: 'death', kind: '你和黄金波一样', title: '死刑',
    body: [
      '黄金波 19 岁。牙克石人，在北京有家有车有房。',
      '他说自己从小有个海员梦。上船以后学会了抽烟，刘贵夺把自己的烟给他，也没提过钱的事。',
      '他是最先坦白的一个，想申报自首情节。没有通过。',
      '刘贵夺一直死硬着，否认了所有的指控。',
      '他父母哭着对记者说：要是船上的人都能像鱼一样游泳就好了。',
      '在看守所里，刘贵夺鼓动同监的死刑犯跟他一起跑。第二天就被举报了。',
      '从那以后，他被四肢固定在床板上，四年多。'
    ]
  }
},

e_four: {
  id: 'e_four', act: '结局', mood: 'calm',
  ending: {
    key: 'four', kind: '你活着回来了', title: '回家给妈做饭',
    body: [
      '宣判的时候你听到「有期徒刑四年」，心里乐坏了。当庭表示不上诉。',
      '开庭那天，你戴着手铐脚镣走进法庭，看见母亲坐在旁听席上，泪流不止。',
      '你出狱那年 29 岁。女朋友去了上海，断了联系。',
      { t: '什么都没有了，得从头开始。', cls: 'q' },
      '走之前你隔着铁栏杆喊黄金波：我要出去了，缺什么东西？我给你邮点儿。',
      { t: '「不用了，家里都给寄了。你自己出去别再那啥了，小心点。」', cls: 'q' },
      '现在你每天下午五点回家给妈做饭。她在一个工厂做工。',
      '她不允许你出远门。你答应过她，今后再也不会离开家乡。'
    ]
  }
}

  });
})();
