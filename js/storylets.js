/* ═══════════════════════════════════════════════════════════════
   《公海》storylet 池（QBN）
   ─────────────────────────────────────────────────────────────
   这些不是主线，是「夜里有人来找你」。
   每一段都有解锁条件，条件由玩家状态表达。

   关键设计：**沾过血的人和没沾血的人，看到的是两条船。**
   act2 池里有专供 bloodMax:0 的段（还有人拿你当人），
   也有只在 bloodMin:1 之后才出现的段（你已经开始听懂他们的话）。

   写作原则：一个 storylet 五到九行，一行一句话。
   每一段里要有一个具体的数、一个小动作，和人物的一句原话。
   主角在船底见过那个阀这件事，在 act1、act2 的池子里反复出现——
   在全船人都在看人的时候，他还能看得懂机器。

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
  require: { flag: 'phase_peru', why: '往秘鲁去的那四十天早就过去了。' },
  act: '夜', place: '十二人间', mood: 'calm', ambience: 'sea',
  imgSlot: '十二人间里围着一盏灯推牌九，一堆皱钞票。看不清脸。',
  text: [
    '往秘鲁去的那四十天，舱里天天推牌九。',
    '牌摊在铺板上，四角压着皱钞票，最小的也是五块十块。',
    '崔勇把你的钱借走了两三千，一把一把全输在台上。',
    { t: '「再借我五百，这把肯定翻本。」', cls: 'q' },
    '他输急了就脱鞋，说鞋底底下压着运气。',
    '你在机舱值班的时候，能听见头顶上那一屋子人一块儿喊「开」。',
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
    '海上有收购船。舱里的鱼满了，就得靠过去卸货。',
    '下到舱底，一人 50 盘，一盘 30 斤，往上举。那是全船最累的活。',
    '赶上卸货，可能两天一夜都不能睡。',
    '你个头矮，举不上去。刘贵夺一般都不让你下舱。',
    '你一共下去过一两次，都是他帮你举。',
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
    '钓鱿鱼是晚上天黑开始。灯一打开，鱿鱼冲着光就游过来。',
    '钩沉下去，感觉有鱼往上薅就行了，没什么技术含量。',
    '可几个月下来，你钓的总比别人少。',
    '有一个月，刘贵夺钓了 13000 多斤。',
    { t: '「50 米的水层没有鱼，就下 70 米。」', cls: 'q' },
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
    '他总坐在食堂最里头那个位置，说话声音不大，一屋子都听得见。',
    { t: '「我以前弄死过人，打过两回劳改。」', cls: 'q' },
    '说这话的时候，他手里一直搓着一根烟，搓了半天没点。',
    '后来才知道，那两次都是盗窃。',
    '船上至少有两个人的档案里带着事，其中一个还被判过无期。'
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
    '轮机长温斗和温密是叔伯兄弟，两个人住一个机舱四人间。',
    '温斗管机器，管得很好。主机该换油了，他不用看表，听声音就知道。',
    '他教你站在主机旁边听：匀不匀，你听得出来。',
    { t: '「你耳朵行。这船上的毛病，一半是听出来的。」', cls: 'q' },
    '别的人站在那儿，只觉得吵。',
    '船上的人多半是熟人互相叫来的。',
    '二副王永波是吴国志妻子的表兄，王鹏是温斗学驾驶时候的师弟。',
    '一圈人，都是自己人叫来的。'
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
    '王鹏 25 岁，大连人，是温斗学驾驶时候的师弟。',
    '温斗叫他来，他家里人反对。',
    { t: '「我想出去闯一闯，挣够了就回来。」', cls: 'q' },
    '他说这话的时候，正蹲在前甲板上缠一段旧绳子，缠得很紧。',
    '他说他家里人后来不拦了，只让他每个月打个电话。',
    '船上打一次电话要排队，还得看是谁用。他一次也没打。'
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
    '马玉超在写日记。他写得慢，一个字一个字地写。',
    '写完了还要念一遍，念给自己听。',
    '他念了一小段给你听，有点像诗，你听不太懂。',
    { t: '「等回去了，我想考个编制。」', cls: 'q' },
    '他说他不想再出远门了，找个离家近的活就行。',
    '下铺的床板一响，他就伸手把纸按住。',
    '他的本子一直塞在枕头底下，从来没让别人看过。',
    '他说这条船上，只有你问过他在写什么。'
  ],
  choices: [
    { label: '「你写吧。我不告诉别人。」', effect: { rel: { ma: +3 }, body: -2 } },
    { label: '「这东西别让人看见。」', effect: { rel: { ma: +2 }, body: -3, flags: { warned_ma: true } } },
    { label: '「考编也不是那么容易。」', effect: { rel: { ma: -1 }, body: +2 } }
  ]
},

s_jiang_kneel: {
    id: 's_jiang_kneel', storylet: true, pool: 'act1', weight: 2, once: true,
  require: { noneOf: ['phase_plan'], why: '这事后来你亲眼见过,不用别人再讲一遍。' },
  /* 这一场和主线 p_jiang 是同一件事。这里先看过一次,
     主线那边就少讲一遍——否则玩家会把同一场戏看两遍。 */
  onEnter: { flags: { saw_jiang_kneel: true } }, act: '夜', place: '食堂', mood: 'tense', ambience: 'quiet',
  imgSlot: '食堂里一个人跪在地上，另一个人站着。只拍背影和手。',
  text: [
    '出事以前有天晚上，老夏喝了酒，骂姜晓龙。',
    '两个人在食堂里吵起来。老夏嗓门大，一句压一句。',
    '姜晓龙回舱拿了把刀，上去就扎，没扎着。',
    '你们几个下去把两个人拉开。刀是夺下来了，谁的手划破了，没人看清。',
    '船长给了姜晓龙几巴掌，说要撵他下船。',
    '姜晓龙当场跪在船长脚边。',
    { t: '「我错了，我喝多了，你让我留下。」', cls: 'q' },
    '刘贵夺也在旁边帮他说了两句。可能从那天起，两个人就有点仇了。'
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
  require: { flag: 'phase_peru', why: '那半个月早就过去了。' },
  text: [
    '晕船那半个月，你记得最清楚的是一只塑料袋。',
    '有人给你递过来，什么都没说，转身就走了。',
    '吃什么都留不住，喝口水也吐出去。',
    '你就抱着那只塑料袋躺着。船在走，天花板在转。',
    { t: '第十六天，忽然就好了。', cls: 'beat' },
    '那天你第一次自己走到甲板上，闻见了柴油味，觉得还挺好闻。',
    '你把塑料袋洗干净还了回去。那个人已经忘了这回事。'
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
    '只有船尾那一片水是亮的，鱿鱼一条一条往上浮。',
    '远处别的渔船也亮着灯，星星点点。',
    '那些光让你觉得这条船是被围着的。',
    '其实四下里只有水。离中国还有一整个太平洋。',
    '你在船尾站到后半夜，风把雨衣吹得鼓起来。',
    '回舱的时候，你的鞋底上粘了两只小鱿鱼，还在动。'
  ],
  choices: [
    { label: '在船尾站很久。', effect: { body: -2, flags: { stared_at_sea: true } } },
    { label: '回舱睡觉。明天还要钓鱼。', effect: { body: +5 } }
  ]
},

s_mail: {
  id: 's_mail', storylet: true, pool: 'act1', weight: 2,
  require: { flag: 'phase_fishing', why: '信是到秘鲁之后才捎上来的。' },
  act: '夜', place: '甲板', mood: 'calm', ambience: 'sea',
  text: [
    '到秘鲁第二个月，公司让收购船捎上来一批信。',
    '收信的人蹲在甲板上看，一遍看完再看一遍。',
    '没有你的。',
    '吉林那个船员收到了他闺女画的画：一条船，船上站着三个人。',
    { t: '「她说等我回去，带她去看海。」', cls: 'q' },
    '他把那张纸折成四折，塞进贴身的口袋。',
    '从那天起，他每次上甲板都先摸一下那个口袋。',
    '你也写了三行，托下一条收购船带回去。写到一半就不知道说什么了。'
  ],
  choices: [
    { label: '把信写完，多写几句家里的事。', effect: { body: -3, standing: +1 } },
    { label: '托他下回替你带一句平安。', effect: { rel: { zhao: +1 }, body: -2 } },
    { label: '把本子合上。写了也是报平安。', effect: { body: +2, smokes: -1 } }
  ]
},

s_freshwater: {
  id: 's_freshwater', storylet: true, pool: 'act1', weight: 2,
  act: '夜', place: '机舱 · 水舱口', mood: 'calm', ambience: 'engine',
  text: [
    '船底有个水舱，装淡水。全船喝的水、洗的水都在里头。',
    '水是配给的，一个人一天两茶缸，洗衣服另算。',
    '机舱的人最费水。你在底下待一下午，出来胸口以下全是油。',
    '温密拎着桶过来，把你的桶也灌了半桶。',
    { t: '「省着点。水舱漏一点，全船就少喝一天。」', cls: 'q' },
    '你把半桶水分成两半：一半擦身，一半泡工服。',
    '洗完的水不倒，留着冲甲板上的鱼血。',
    '水舱口是六角螺栓拧上的。你帮着拧过一次，拧了很久。'
  ],
  choices: [
    { label: '帮温密把水拎到机舱四人间。', effect: { standing: +3, body: -4 } },
    { label: '把自己那半桶分给同屋的人一半。', effect: { standing: +4, body: -5, rel: { zhao: +1 } } },
    { label: '擦一把就算了，省下的水留着洗工服。', effect: { body: +1, standing: -2 } }
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
    '姜晓龙从前面回来，绕着后甲板走了一圈，看有没有别人。',
    '然后他坐到你旁边，跟你唠嗑。',
    { t: '「心理压力别太大，没想动你，不能动你，咱们都是朋友。」', cls: 'q' },
    { t: '「我不一定哪天也下海里去了，能帮上忙我肯定帮一把。」', cls: 'q' },
    '他说这话的时候，手里转着一把鱼刀，刀尖朝下。',
    '甲板洗得很干净，一点血都没有。他们连夜洗的。',
    '你点了下头，没敢多看他手上那件东西。',
    '你心里想的是另一件事：他为什么要专门过来跟你说这个。'
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
    '你躺着听声音。船一直在走。',
    '主机的声音是匀的。你学的是这个，你知道匀意味着什么。',
    '上面有人在走动，走过去，停一下，又走回来。',
    '你数那脚步来回的次数，数到二十几就不敢往下数了。',
    '天快亮的时候，厨房那边的活就要开始了。你还要起来做饭。',
    { t: '你对自己说：先活过今天。', cls: 'inner' }
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
    '黄金波 19 岁，牙克石人，挺高挺瘦，看起来还是个小孩。',
    '他说他在北京有家、有车、有房，条件很好。',
    { t: '「我从小就有个海员梦。」', cls: 'q' },
    '他上船之后学会了抽烟。刘贵夺把自己的烟给他，也没提过钱的事。',
    '他晕倒过一回，说是贫血。那几天他一点活都没干。',
    '他们那伙人开会的时候，他拿个笔记本在旁边记。',
    '你看不出他是真信那些话，还是不敢不信。'
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
    '字写得很快，笔画都连在一起。',
    '他把纸条递给第一个人，让一个个传着看。',
    '有人看完点一下头，有人看完就递给下一个。',
    '没有一个人念出声。',
    '轮到你的时候，纸条上的墨还没干。',
    '看完要还回去。他把纸条折起来收进兜里，没撕。',
    '你不知道他留着那张纸条做什么。'
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
    '包德一伙是坏人，先跑的那四个是坏人。',
    '剩下的十一个人是被劫持的好人。',
    { t: '「回去就这么说，一个字都别改。」', cls: 'q' },
    '有人把话写在纸上，写完又划掉，重新写。',
    '纸揉成团，塞进灶膛里烧了。',
    '你跟着念了两遍。念到第三遍的时候，自己都快信了。'
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
    '他在建筑工地、养殖场都卖过苦力。',
    '他爸平时只抽自己种的烤烟，舍不得买盒烟。',
    '决定上船那天，他爸开拖拉机送他到县城。',
    '他买了两包香烟塞给他爸。',
    { t: '「我爸那天把烟揣兜里，一路上没舍得抽。」', cls: 'q' },
    '家人说他孝顺、聪明，就是后悔辍学早。'
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
    '水桶换了四五回，最后倒下去的都是清水了。',
    '那阵儿有人说：那家伙装逼。',
    '说的是老夏。',
    '一说起他，就有好几个人跟着笑。',
    '你也在那儿站着，跟着笑了一声，然后就笑不下去了。',
    '老夏的围裙还搭在厨房门口。没有人去摘。'
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
    '刘贵夺一天三盒，谁也不敢问他那烟是哪儿来的。',
    '你自己带了 30 条，本来是准备抽两年的。',
    '你把烟拆开，一盒一盒地数，数完又收回去。',
    '有人拿冻猪肉跟你换过，有人拿手表跟你换过。',
    { t: '「两盒，替我看一个夜班。」', cls: 'q' },
    '你把烟塞回铺底下的铁盒里，铁盒又塞回被子里。'
  ],
  choices: [
    { label: '拿烟换一次不值班。', effect: { smokes: -1, body: +8 } },
    { label: '把烟收好。以后更用得着。', effect: { body: -3 } },
    { label: '把烟分给同屋的人。', effect: { smokes: -2, standing: +6, rel: { zhao: +2 } } }
  ]
},

s_liu_rounds: {
  id: 's_liu_rounds', storylet: true, pool: 'act2', weight: 2,
  act: '夜', place: '寝室', mood: 'blood', ambience: 'quiet',
  text: [
    '后半夜，你听见舱门被推开。',
    '刘贵夺拿着手电，一个铺一个铺照过去。',
    '他不说话。光照到脸上，你就得睁一下眼。',
    '你躺着没动。机器在你脚底下转，快一拍慢一拍你都听得出来。',
    '有人的铺是空的。他站在那儿停了几秒，把被子掀开看了看。',
    '走到你床边，他弯下腰问了一句：',
    { t: '「刚才谁跟你说过话？」', cls: 'q' },
    '你说没有。他看了你一会儿，把手电关了。'
  ],
  choices: [
    { label: '照实说：白天有人跟你聊过。', effect: { standing: +3, body: -5,
      flags: { told_liu_truth: true } } },
    { label: '「没有人。」', effect: { standing: -2, body: -3 } },
    { label: '反问他一句：你在找谁。', effect: { rel: { liu: -1 }, body: -5,
      standing: +2 }, tone: 'risk' }
  ]
},

s_two_bands: {
  id: 's_two_bands', storylet: true, pool: 'act2', weight: 2,
  act: '夜', place: '甲板', mood: 'tense', ambience: 'quiet',
  text: [
    '甲板上分成两堆：船头一堆，船尾一堆。',
    '包德那一伙是内蒙古人，说话用蒙古语，别人一个字也听不懂。',
    '刘贵夺那一伙多是黑龙江的。他们说话的时候把声音压得很低。',
    '两边都不在你面前说正事。',
    '黄金波两边都坐过一会儿，后来还是回了刘贵夺那边。',
    '有一次你听见包德用汉语说了一句：',
    { t: '「我们也是来挣钱的。」', cls: 'q' },
    '说完他就换了蒙古语，又是一串你听不懂的话。'
  ],
  choices: [
    { label: '往刘贵夺那一堆坐。', effect: { rel: { liu: +1 }, standing: +3, body: -3 } },
    { label: '回机舱去。机器不结帮。', effect: { body: -3, standing: -2 } },
    { label: '让包德教你一句蒙古语。', effect: { standing: +2, rel: { liu: -1 }, body: -3,
      flags: { learned_mongolian: true } } }
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
    '刘贵夺故意躲开其他船只。',
    '只有一次停下来换机油滤芯。这活只有你还干得了。',
    '远远看到一艘船，没有国旗，没有船号。',
    '它停在两三海里外，二十多分钟后开走了。',
    '很多人说那是海盗船。',
    { t: '「渔船没什么钱，海盗不感兴趣。」', cls: 'q' },
    '海上跟陆地不一样。就那么一艘船飘着，你摆脱不了。'
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
    '浪从船头打过来，越过舵楼，落在后甲板上。',
    '船动不了，只能等。',
    '机舱进了水。泵抽出去，抽完了又进。',
    '有人在舱里吐，吐完了就躺着，谁也不说话。',
    '你不知道救援船会不会来。',
    '你也不知道它来的时候，你还活着没有。',
    '你数浪打过来的间隔，数到第七下就不数了。'
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
    '洗碗池里堆着一排没洗的碗，谁也不想洗。',
    '赵木成靠着栏杆抽烟，手上还带着做饭的油烟味。',
    { t: '「那时候根本没想过能活着回来，就想死也死得离家近点儿。」', cls: 'q' },
    { t: '「我不相信有鬼。万一有，我离家近点做鬼。」', cls: 'q' },
    '没有人接这句话。',
    '船底的水泵还在响，隔一会儿响一阵。'
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
    '船长写，刘贵夺在旁边看，写一句念一句。',
    '写了一遍，撕了，又写一遍。',
    '纸条上写的是：包德一伙行凶后乘木筏逃走，剩下 11 名幸存者。',
    '写完了要交到每个人手里，各自背熟。',
    '背不下来的人，就被再叫进去一遍。',
    { t: '「谁要是说岔了，谁都别想好。」', cls: 'q' },
    '你把纸条折起来，塞进鞋垫底下。'
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
  act: '夜', place: '船长室门口', mood: 'calm', ambience: 'deep',
  text: [
    '刘贵夺在甲板上把所有人召集起来，说去日本需要钱。',
    '他要每个人假装生病，用卫星电话跟家里要五千块，转到他一张邮政卡上。',
    '船长室门口排着队，一个一个进去打。',
    '姜晓龙排在前面。他说家里真没钱，没办法打。刘贵夺让他多少打点。',
    { t: '「结果我俩吵了一架。」', cls: 'q' },
    '很多船员家里拿不出五千块。',
    '轮到你的时候，刘贵夺看了你一眼。',
    { t: '「打吧。告诉你妈过段时间就回去了，别担心。」', cls: 'q' }
  ],
  choices: [
    { label: '打给妈，按他教的要钱。', effect: { standing: +5, body: -8,
      flags: { called_home: true } } },
    { label: '打给妈，但是不提钱。', effect: { body: -5, standing: -3,
      flags: { told_truth_home: true } } },
    { label: '把电话还回去。不打。', effect: { standing: -5, body: -4,
      flags: { refused_call: true } } }
  ]
},

s_rescue_rumor: {
  id: 's_rescue_rumor', storylet: true, pool: 'act3', weight: 2,
  act: '夜', place: '甲板', mood: 'tense', ambience: 'deep',
  text: [
    '有人在传，说渔政船三天之内就到。',
    '传话的人说得有鼻子有眼：船身刷着「中国渔政」，还放小艇。',
    '另一个人说，别做梦了，国际救援要走手续，光批文就得半个月。',
    '刘贵夺已经让船长把通讯设备修好了。求救信号发了出去。',
    '求救的时候，报的是船上还有 15 个人。',
    '这个数是怎么算出来的，没人敢问。',
    { t: '「别问。问了就是你的事。」', cls: 'q' },
    '夜里你听见远处有螺旋桨的声音。你出去看，什么都没有。'
  ],
  choices: [
    { label: '去问刘贵夺，救援到底哪天来。', effect: { rel: { liu: -1 }, body: -4,
      flags: { asked_about_rescue: true } } },
    { label: '把剩下的淡水数一遍，能撑几天算几天。', effect: { body: -3, standing: +2 } },
    { label: '什么也不问。等就是了。', effect: { body: +4, standing: -2 } }
  ]
}

  });
})();
