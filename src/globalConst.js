/* eslint-disable new-cap */
/* eslint-disable max-len */
/**
 * 描述
 * @date 2022-08-23
 * @param {any} Blockly
 */
function globalConst(Blockly) {
  Blockly.Python.blank = '__';

  Blockly.COMPREHENSION_SETTINGS = {
    'list_comp': {
      start: '[',
      end: ']',
      color: 30,
    }, 'set_comp': {
      start: '{',
      end: '}',
      color: 30,
    }, 'dict_comp': {
      start: '{',
      end: '}',
      color: 0,
    }, 'generator_expr': {
      start: '(',
      end: ')',
      color: 15,
    },
  };

  Blockly.ITERATOR_SETTINGS = {
    'set': {
      color: '#B53471',
      output: 'Set',
      emptyMsg: 'SETS_CREATE_EMPTY_TITLE',
      inputMsg: 'SETS_CREATE_WITH_INPUT_WITH',
    },
    'dict': {
      color: '#833471',
      output: 'Dict',
      emptyMsg: 'DICTS_CREATE_EMPTY_TITLE',
      inputMsg: 'DICTS_CREATE_WITH_INPUT_WITH',
    },
    'tuple': {
      color: '#5758BB',
      output: 'Tuple',
      emptyMsg: 'TUPLES_CREATE_EMPTY_TITLE',
      inputMsg: 'TUPLES_CREATE_WITH_INPUT_WITH',
    },
  };

  Blockly.BINOPS = [
    [
      '+', 'Add',
      Blockly.Python.ORDER_ADDITIVE, '加',
    ],
    [
      '-', 'Sub',
      Blockly.Python.ORDER_ADDITIVE, '减',
    ],
    [
      '*', 'Mult',
      Blockly.Python.ORDER_MULTIPLICATIVE, '乘',
    ],
    [
      '/', 'Div',
      Blockly.Python.ORDER_MULTIPLICATIVE, '除',
    ],
    [
      '%', 'Mod',
      Blockly.Python.ORDER_MULTIPLICATIVE, '模',
    ],
    [
      '**', 'Pow',
      Blockly.Python.ORDER_EXPONENTIATION, '升',
    ],
    ['//', 'FloorDiv',
      Blockly.Python.ORDER_MULTIPLICATIVE, '斩',
    ],
    ['<<', 'LShift',
      Blockly.Python.ORDER_BITWISE_SHIFT, '左移',
    ],
    ['>>', 'RShift',
      Blockly.Python.ORDER_BITWISE_SHIFT, '右移',
    ],
    [
      '|', 'BitOr',
      Blockly.Python.ORDER_BITWISE_OR, '或',
    ],
    [
      '^', 'BitXor',
      Blockly.Python.ORDER_BITWISE_XOR, '异或',
    ],
    [
      '&', 'BitAnd',
      Blockly.Python.ORDER_BITWISE_AND, '与',
    ],
  ];
  Blockly.TRY_SETTINGS = {
    HANDLERS_CATCH_ALL: 0,
    HANDLERS_NO_AS: 1,
    HANDLERS_COMPLETE: 3,
  };

  Blockly.BINOPS_BLOCKLY_DISPLAY = Blockly.BINOPS.map(
      (binop) => [binop[0], binop[1]],
  );
  Blockly.BINOPS_AUGASSIGN_DISPLAY = Blockly.BINOPS.map(
      (binop) => [binop[3], binop[1]],
  );
  Blockly.BINOPS_BLOCKLY_GENERATE = {};
  Blockly.BINOPS.forEach(function(binop) {
    Blockly.BINOPS_BLOCKLY_GENERATE[binop[1]] = [' ' + binop[0], binop[2]];
  });

  Blockly.COMPARES = [
    ['==', 'Eq', 'Return whether the two values are equal.'],
    ['!=', 'NotEq', 'Return whether the two values are not equal.'],
    ['<', 'Lt', 'Return whether the left value is less than the right value.'],
    ['<=', 'LtE', 'Return whether the left value is less than or equal to the' +
  'right value.'],
    ['>', 'Gt',
      'Return whether the left value is greater than the right value.'],
    ['>=', 'GtE', 'Return whether the left value is greater than or equal to ' +
  'the right value.'],
    ['is', 'Is', 'Return whether the left value is identical to the right ' +
  'value.'],
    ['is not', 'IsNot', 'Return whether the left value is not identical to ' +
  'the right value.'],
    ['in', 'In', 'Return whether the left value is in the right value.'],
    ['not in', 'NotIn', 'Return whether the left value is not in the '+
  'right value.'],
  ];
  Blockly.COMPARES_BLOCKLY_DISPLAY = Blockly.COMPARES.map(
      (boolop) => [boolop[0], boolop[1]],
  );
  Blockly.COMPARES_BLOCKLY_GENERATE = {};
  Blockly.COMPARES.forEach(function(boolop) {
    Blockly.COMPARES_BLOCKLY_GENERATE[boolop[1]] = boolop[0];
  });

  Blockly.UNARYOPS = [
    [
      '+', 'UAdd',
      'Do nothing to the number',
      '%{BKY_UNARYOPS_UADD}',
    ],
    [
      '-', 'USub',
      'Make the number negative',
      '%{BKY_UNARYOPS_USUB}',
    ],
    [
      'not', 'Not',
      'Return the logical opposite of the value.',
      '%{BKY_UNARYOPS_NOT}',
    ],
    [
      '~', 'Invert',
      'Take the bit inversion of the number',
      '%{BKY_UNARYOPS_INVERT}',
    ],
  ];

  Blockly.Msg.TYPES_GET_TITLE = '获取 %1 的变量类型';
  Blockly.Msg.TYPES_CONVERT_TITLE = '把 %2 转类型为 %1';
  Blockly.Msg.TYPES_INT = '整数类型';
  Blockly.Msg.TYPES_FLOAT = '浮点数类型';
  Blockly.Msg.TYPES_COMPLEX = '复数类型';
  Blockly.Msg.TYPES_STR = '字符串类型';
  Blockly.Msg.TYPES_BOOL = '布尔类型';
  Blockly.Msg.TYPES_LIST = '列表类型';
  Blockly.Msg.TYPES_SET = '集合类型';
  Blockly.Msg.TYPES_FROZENSET = '不可变集合类型';
  Blockly.Msg.TYPES_TUPLE = '元组类型';
  Blockly.Msg.TYPES_DICT = '字典类型';
  Blockly.Msg.TYPES_RANGE = '范围类型';
  Blockly.Msg.ADD_COMMENT = '添加注释 %1';
  Blockly.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE = '不能删除变量“%1”，因为它是函数“%2”定义的一部分';
  Blockly.Msg.CHANGE_VALUE_TITLE = '更改值：';
  Blockly.Msg.CLEAN_UP = '整理块';
  Blockly.Msg.COLLAPSED_WARNINGS_WARNING = '已收起的信息块内包含警告。';
  Blockly.Msg.COLLAPSE_ALL = '折叠块';
  Blockly.Msg.COLLAPSE_BLOCK = '折叠块';
  Blockly.Msg.COLOUR_BLEND_COLOUR1 = '颜色1';
  Blockly.Msg.COLOUR_BLEND_COLOUR2 = '颜色2';
  Blockly.Msg.COLOUR_BLEND_HELPURL = 'https://meyerweb.com/eric/tools/color-blend/#:::rgbp'; // untranslated
  Blockly.Msg.COLOUR_BLEND_RATIO = '比例';
  Blockly.Msg.COLOUR_BLEND_TITLE = '混合';
  Blockly.Msg.COLOUR_BLEND_TOOLTIP = '把两种颜色以一个给定的比例(0.0-1.0)进行混合。';
  Blockly.Msg.COLOUR_PICKER_HELPURL = 'https://zh.wikipedia.org/wiki/颜色';
  Blockly.Msg.COLOUR_PICKER_TOOLTIP = '从调色板中选择一种颜色。';
  Blockly.Msg.COLOUR_RANDOM_HELPURL = 'http://randomcolour.com'; // untranslated
  Blockly.Msg.COLOUR_RANDOM_TITLE = '随机颜色';
  Blockly.Msg.COLOUR_RANDOM_TOOLTIP = '随机选择一种颜色。';
  Blockly.Msg.COLOUR_RGB_BLUE = '蓝色';
  Blockly.Msg.COLOUR_RGB_GREEN = '绿色';
  Blockly.Msg.COLOUR_RGB_HELPURL = 'https://www.december.com/html/spec/colorpercompact.html'; // untranslated
  Blockly.Msg.COLOUR_RGB_RED = '红色';
  Blockly.Msg.COLOUR_RGB_TITLE = '颜色';
  Blockly.Msg.COLOUR_RGB_TOOLTIP = '通过指定红色、绿色和蓝色的量创建一种颜色。所有的值必须在0和100之间。';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL = 'https://github.com/google/blockly/wiki/Loops#loop-termination-blocks'; // untranslated
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK = '跳出循环';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE = '继续下一轮循环';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK = '跳出包含它的循环。';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE = '跳过本轮循环的剩余部分，并继进行续下一轮迭代。';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING = '警告：这个块只能在循环内使用。';
  Blockly.Msg.CONTROLS_FOREACH_HELPURL = 'https://github.com/google/blockly/wiki/Loops#for-each'; // untranslated
  Blockly.Msg.CONTROLS_FOREACH_TITLE = '为 %2 里的每一项 %1';
  Blockly.Msg.CONTROLS_FOREACH_TOOLTIP = '遍历列表中的每一项，将变量“%1”设为所选项，并执行一些语句。';
  Blockly.Msg.CONTROLS_FOR_HELPURL = 'https://github.com/google/blockly/wiki/Loops#count-with'; // untranslated
  Blockly.Msg.CONTROLS_FOR_TITLE = '变量 %1 从 %2 数到 %3 每次增加 %4';
  Blockly.Msg.CONTROLS_FOR_TOOLTIP = '用变量%1记录从开始数值到终止数值之间的数值，数值按指定间隔增加，并执行指定的块。';
  Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP = '在这个if语句块中增加一个条件。';
  Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP = '在这个if语句块中添加一个最终的，包括所有其余情况的条件。';
  Blockly.Msg.CONTROLS_IF_HELPURL = 'https://github.com/google/blockly/wiki/IfElse'; // untranslated
  Blockly.Msg.CONTROLS_IF_IF_TOOLTIP = '增加、删除或重新排列各节来重新配置这个if语句块。';
  Blockly.Msg.CONTROLS_IF_MSG_ELSE = '否则';
  Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = '否则如果';
  Blockly.Msg.CONTROLS_IF_MSG_IF = '如果';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_1 = '如果值为真，执行一些语句。';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_2 = '如果值为真，则执行第一块语句。否则，则执行第二块语句。';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_3 = '如果第一个值为真，则执行第一块的语句。否则，如果第二个值为真，则执行第二块的语句。';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_4 = '如果第一个值为真，则执行第一块对语句。否则，如果第二个值为真，则执行语句的第二块。如果没有值为真，则执行最后一块的语句。';
  Blockly.Msg.CONTROLS_REPEAT_HELPURL = 'https://zh.wikipedia.org/wiki/For循环';
  Blockly.Msg.CONTROLS_REPEAT_INPUT_DO = '执行';
  Blockly.Msg.CONTROLS_REPEAT_INPUT_ELSE = '此后执行';
  Blockly.Msg.CONTROLS_REPEAT_TITLE = '重复 %1 次';
  Blockly.Msg.CONTROLS_REPEAT_TOOLTIP = '多次执行一些语句。';
  Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL = 'https://github.com/google/blockly/wiki/Loops#repeat'; // untranslated
  Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL = '重复直到条件满足';
  Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE = '当条件满足时重复';
  Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL = '只要值为假，执行一些语句。';
  Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE = '只要值为真，执行一些语句。';
  Blockly.Msg.DELETE_ALL_BLOCKS = '删除所有 %1 个块吗？';
  Blockly.Msg.DELETE_BLOCK = '删除块';
  Blockly.Msg.DELETE_VARIABLE = '删除变量“%1”';
  Blockly.Msg.DELETE_VARIABLE_CONFIRMATION = '要删除对变量“%2”的%1个引用吗？';
  Blockly.Msg.DELETE_X_BLOCKS = '删除 %1 个块';
  Blockly.Msg.DISABLE_BLOCK = '禁用块';
  Blockly.Msg.DUPLICATE_BLOCK = '复制';
  Blockly.Msg.DUPLICATE_COMMENT = '复制注释';
  Blockly.Msg.ENABLE_BLOCK = '启用块';
  Blockly.Msg.EXPAND_ALL = '展开块';
  Blockly.Msg.EXPAND_BLOCK = '展开块';
  Blockly.Msg.EXTERNAL_INPUTS = '外部输入';
  Blockly.Msg.HELP = '帮助';
  Blockly.Msg.INLINE_INPUTS = '单行输入';
  Blockly.Msg.IOS_CANCEL = '取消';
  Blockly.Msg.IOS_ERROR = '错误';
  Blockly.Msg.IOS_OK = '确定';
  Blockly.Msg.IOS_PROCEDURES_ADD_INPUT = '+添加输入';
  Blockly.Msg.IOS_PROCEDURES_ALLOW_STATEMENTS = '允许的语句';
  Blockly.Msg.IOS_PROCEDURES_DUPLICATE_INPUTS_ERROR = '这个函数有多个输入。';
  Blockly.Msg.IOS_PROCEDURES_INPUTS = '输入';
  Blockly.Msg.IOS_VARIABLES_ADD_BUTTON = '添加';
  Blockly.Msg.IOS_VARIABLES_ADD_VARIABLE = '+添加变量';
  Blockly.Msg.IOS_VARIABLES_DELETE_BUTTON = '删除';
  Blockly.Msg.IOS_VARIABLES_EMPTY_NAME_ERROR = '你不能使用空白的变量名。';
  Blockly.Msg.IOS_VARIABLES_RENAME_BUTTON = '重命名';
  Blockly.Msg.IOS_VARIABLES_VARIABLE_NAME = '变量名';
  Blockly.Msg.SETS_CREATE_WITH_CONTAINER_TITLE_ADD = '集合';
  Blockly.Msg.SETS_CREATE_EMPTY_TITLE = '创建空集合';
  Blockly.Msg.SETS_CREATE_WITH_INPUT_WITH = '使用下列元素创建集合';
  Blockly.Msg.SETS_ONTWO_OPERATOR_INTERSECT = '交';
  Blockly.Msg.SETS_ONTWO_OPERATOR_UNION = '并';
  Blockly.Msg.SETS_ONTWO_OPERATOR_DIFFERENCE = '差';
  Blockly.Msg.SETS_ONTWO_OPERATOR_SYMMETRIC_DIFFERENCE = '对称差';
  Blockly.Msg.SETS_SIZE_TITLE = '取 %1 的势（规模大小）';
  Blockly.Msg.SETS_SIZE_TOOLTIP = '返回集合中的元素的个数。';
  Blockly.Msg.SETS_CHANGE_TITLE = '对集合 %1 %2元素 %3';
  Blockly.Msg.SETS_CHANGE_ADD = '添加';
  Blockly.Msg.SETS_CHANGE_REMOVE = '删除';
  Blockly.Msg.SETS_CHANGE_TOOLTIP = '按照指定方式修改集合。';
  Blockly.Msg.SETS_ISEMPTY_TITLE = '%1是空集';
  Blockly.Msg.SETS_ISEMPTY_TOOLTIP = '如果集合为空，则返回真。';
  Blockly.Msg.SETS_POP_TITLE = '移除并返回%1中的一个随机元素';
  Blockly.Msg.SETS_POP_TOOLTIP = '从给定集合中随机移除一个元素。';
  Blockly.Msg.LISTS_CREATE_EMPTY_HELPURL = 'https://github.com/google/blockly/wiki/Lists#create-empty-list';
  Blockly.Msg.LISTS_CREATE_EMPTY_TITLE = '创建空列表';
  Blockly.Msg.LISTS_CREATE_EMPTY_TOOLTIP = '返回一个列表，长度为 0，不包含任何数据记录';
  Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD = '列表';
  Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP = '增加、删除或重新排列各部分以此重新配置这个列表块。';
  Blockly.Msg.LISTS_CREATE_WITH_HELPURL = 'https://github.com/google/blockly/wiki/Lists#create-list-with';
  Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = '使用下列元素创建列表';
  Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP = '将一个元素添加到列表中。';
  Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP = '建立一个具有任意数量元素的列表。';
  Blockly.Msg.LISTS_GET_INDEX_FIRST = '首个';
  Blockly.Msg.LISTS_GET_INDEX_FROM_END = '下标为负';
  Blockly.Msg.LISTS_GET_INDEX_FROM_START = '下标为';
  Blockly.Msg.LISTS_GET_INDEX_GET = '取得';
  Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE = '取得并移除';
  Blockly.Msg.LISTS_GET_INDEX_LAST = '最后一个';
  Blockly.Msg.LISTS_GET_INDEX_RANDOM = '随机的';
  Blockly.Msg.LISTS_GET_INDEX_REMOVE = '移除';
  Blockly.Msg.LISTS_GET_INDEX_TAIL = '元素';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST = '返回的首个元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM = '返回指定位置的元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST = '返回最后一个元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM = '返回随机一个元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST = '移除并返回首个元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM = '移除并返回指定位置的元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST = '移除并返回最后一个元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM = '移除并返回随机的一个元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST = '移除首个元素';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM = '移除指定位置的元素。';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST = '移除最后一个元素';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM = '删除随机的一个元素。';
  Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END = '元素到下标为负';
  Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START = '元素到下标为';
  Blockly.Msg.LISTS_GET_SUBLIST_END_LAST = '元素到最后一个';
  Blockly.Msg.LISTS_GET_SUBLIST_HELPURL = 'https://github.com/google/blockly/wiki/Lists#getting-a-sublist'; // untranslated
  Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST = '取得从首位';
  Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END = '取得从下标为负';
  Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START = '取得从下标为';
  Blockly.Msg.LISTS_GET_SUBLIST_TAIL = '元素获取子列表';
  Blockly.Msg.LISTS_GET_SUBLIST_STEP = '每隔';
  Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP = '复制指定的部分。';
  Blockly.Msg.LISTS_INDEX_FROM_END_TOOLTIP = '%1是最后一个元素。';
  Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP = '%1是首个元素。';
  Blockly.Msg.LISTS_INDEX_OF_FIRST = '寻找第一次出现的元素';
  Blockly.Msg.LISTS_INDEX_OF_HELPURL = 'https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list'; // untranslated
  Blockly.Msg.LISTS_INDEX_OF_LAST = '寻找最后一次出现的元素';
  Blockly.Msg.LISTS_INDEX_OF_TOOLTIP = '返回在第一/最后一个匹配元素的索引值。如果找不到元素则返回%1。';
  Blockly.Msg.LISTS_INLIST = '从';
  Blockly.Msg.LISTS_ISEMPTY_HELPURL = 'https://github.com/google/blockly/wiki/Lists#is-empty'; // untranslated
  Blockly.Msg.LISTS_ISEMPTY_TITLE = '%1是空列表';
  Blockly.Msg.LISTS_ISEMPTY_TOOLTIP = '如果列表为空，则返回真。';
  Blockly.Msg.LISTS_LENGTH_HELPURL = 'https://github.com/google/blockly/wiki/Lists#length-of'; // untranslated
  Blockly.Msg.LISTS_LENGTH_TITLE = '取 %1 的长度';
  Blockly.Msg.LISTS_LENGTH_TOOLTIP = '返回列表的长度。';
  Blockly.Msg.LISTS_REPEAT_HELPURL = 'https://github.com/google/blockly/wiki/Lists#create-list-with'; // untranslated
  Blockly.Msg.LISTS_REPEAT_TITLE = '使用 %1 元素重复 %2 次创建列表';
  Blockly.Msg.LISTS_REPEAT_TOOLTIP = '建立包含指定重复次数的值的列表。';
  Blockly.Msg.LISTS_REVERSE_HELPURL = 'https://github.com/google/blockly/wiki/Lists#reversing-a-list';
  Blockly.Msg.LISTS_REVERSE_MESSAGE0 = '倒转%1';
  Blockly.Msg.LISTS_REVERSE_TOOLTIP = '倒转一个列表的拷贝。';
  Blockly.Msg.LISTS_SET_INDEX_HELPURL = 'https://github.com/google/blockly/wiki/Lists#in-list--set'; // untranslated
  Blockly.Msg.LISTS_SET_INDEX_INPUT_TO = '元素值为';
  Blockly.Msg.LISTS_SET_INDEX_INSERT = '插入在';
  Blockly.Msg.LISTS_SET_INDEX_SET = '设置';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST = '在列表的起始处添加该元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM = '插入在列表中指定位置的元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST = '在列表的末尾处添加该元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM = '在列表的随机位置插入该元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST = '设置列表中的第一个元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM = '设置在列表中指定位置的元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST = '设置列表中的最后一个元素。';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM = '设置列表中的随机一个元素。';
  Blockly.Msg.LISTS_SORT_HELPURL = 'https://github.com/google/blockly/wiki/Lists#sorting-a-list';
  Blockly.Msg.LISTS_SORT_ORDER_ASCENDING = '升序';
  Blockly.Msg.LISTS_SORT_ORDER_DESCENDING = '降序';
  Blockly.Msg.LISTS_SORT_TITLE = '将列表 %3 中元素 %1 为 %2 ';
  Blockly.Msg.LISTS_SORT_TOOLTIP = '排序一个列表的拷贝。';
  Blockly.Msg.LISTS_SORT_TYPE_IGNORECASE = '按字典序排序，忽略大小写';
  Blockly.Msg.LISTS_SORT_TYPE_NUMERIC = '按数值关系排序';
  Blockly.Msg.LISTS_SORT_TYPE_TEXT = '按字典序排序';
  Blockly.Msg.LISTS_SPLIT_HELPURL = 'https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists';
  Blockly.Msg.LISTS_SPLIT_LIST_FROM_TEXT = '从文本制作列表';
  Blockly.Msg.LISTS_SPLIT_TEXT_FROM_LIST = '从列表拆出文本';
  Blockly.Msg.LISTS_SPLIT_TOOLTIP_JOIN = '加入文本列表至一个文本，由分隔符分隔。';
  Blockly.Msg.LISTS_SPLIT_TOOLTIP_SPLIT = '拆分文本到文本列表，按每个分隔符拆分。';
  Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER = '用分隔符';
  Blockly.Msg.LISTS_MAP_TITLE = '对于 %1 中每个元素应用 %2 函数得到新列表';
  Blockly.Msg.LISTS_MAP_TOOLTIP = '对于每个列表元素调用指定函数';
  Blockly.Msg.LISTS_JOIN_TITLE = '把列表 %1 中的元素用 %2 连接为字符串';
  Blockly.Msg.LISTS_JOIN_TOOLTIP = '通过指定分隔符连接列表元素为字符串';
  Blockly.Msg.LISTS_CONCAT_TITLE = '把列表 %1 与 %2 连接为新列表';
  Blockly.Msg.LISTS_CONCAT_TOOLTIP = '连接两列表为新的列表';
  Blockly.Msg.LISTS_REPEAT_TIMES_TITLE = '首尾相接 %1 列表 %2 次为新列表';
  Blockly.Msg.LISTS_REPEAT_TIMES_TOOLTIP = '将给定列表首尾相接重复指定次数作为新列表';
  Blockly.Msg.RANGE_CREATE = '从 %1 到 %2 每往后 %3 个取一次数组成一个范围';
  Blockly.Msg.LOGIC_BOOLEAN_FALSE = '假';
  Blockly.Msg.LOGIC_BOOLEAN_HELPURL = 'https://github.com/google/blockly/wiki/Logic#values'; // untranslated
  Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP = '爻';
  Blockly.Msg.LOGIC_BOOLEAN_TRUE = '真';
  Blockly.Msg.LOGIC_COMPARE_HELPURL = 'https://zh.wikipedia.org/wiki/不等';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ = '如果两个输入结果相等，则返回真。';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT = '如果第一个输入结果比第二个大，则返回真。';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE = '如果第一个输入结果大于或等于第二个输入结果，则返回真。';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT = '如果第一个输入结果比第二个小，则返回真。';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE = '如果第一个输入结果小于或等于第二个输入结果，则返回真。';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ = '如果两个输入结果不相等，则返回真。';
  Blockly.Msg.LOGIC_SET_COMPARE = '%1 是 %3 的 %2';
  Blockly.Msg.LOGIC_SET_COMPARE_SUBSET = '子集';
  Blockly.Msg.LOGIC_SET_COMPARE_PROPER_SUBSET = '真子集';
  Blockly.Msg.LOGIC_SET_COMPARE_SUPERSET = '超集';
  Blockly.Msg.LOGIC_SET_COMPARE_PROPER_SUPERSET = '真超集';
  Blockly.Msg.LOGIC_NEGATE_HELPURL = 'https://github.com/google/blockly/wiki/Logic#not';
  Blockly.Msg.LOGIC_NEGATE_TITLE = '非%1';
  Blockly.Msg.LOGIC_NEGATE_TOOLTIP = '如果输入结果为假，则返回真；如果输入结果为真，则返回假。';
  Blockly.Msg.LOGIC_NULL = '空';
  Blockly.Msg.LOGIC_NULL_HELPURL = 'https://en.wikipedia.org/wiki/Nullable_type'; // untranslated
  Blockly.Msg.LOGIC_NULL_TOOLTIP = '返回空值。';
  Blockly.Msg.LOGIC_OPERATION_AND = '并且';
  Blockly.Msg.LOGIC_OPERATION_HELPURL = 'https://github.com/google/blockly/wiki/Logic#logical-operations'; // untranslated
  Blockly.Msg.LOGIC_OPERATION_OR = '或';
  Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND = '如果两个输入结果都为真，则返回真。';
  Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR = '如果至少有一个输入结果为真，则返回真。';
  Blockly.Msg.LOGIC_OPERATION_IS = '是';
  Blockly.Msg.LOGIC_OPERATION_IS_NOT = '不是';
  Blockly.Msg.LOGIC_OPERATION_IN = '存在于';
  Blockly.Msg.LOGIC_OPERATION_NOT_IN = '不存在于';
  Blockly.Msg.LOGIC_TERNARY_CONDITION = '断言';
  Blockly.Msg.LOGIC_TERNARY_HELPURL = 'https://zh.wikipedia.org/wiki/条件运算符';
  Blockly.Msg.LOGIC_TERNARY_IF_FALSE = '如果为假';
  Blockly.Msg.LOGIC_TERNARY_IF_TRUE = '如果为真';
  Blockly.Msg.LOGIC_TERNARY_TOOLTIP = '检查“断言”里的条件语句。如果条件为真，则返回“如果为真”的值，否则，则返回“如果为假”的值。';
  Blockly.Msg.LOGIC_ITERABLE_CHECK = '%1 中 %2 元素为真';
  Blockly.Msg.LOGIC_ITERABLE_ANY = '至少有一个';
  Blockly.Msg.LOGIC_ITERABLE_ALL = '所有';
  Blockly.Msg.MATH_ADDITION_SYMBOL = '+'; // untranslated
  Blockly.Msg.MATH_ARITHMETIC_HELPURL = 'https://zh.wikipedia.org/wiki/算术';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD = '返回两个数值的和。';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE = '返回两个数值的商。';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS = '返回两个数值的差值。';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY = '返回两个数值的乘积。';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER = '返回以第一个数值为底数，以第二个数值为幂的结果。';
  Blockly.Msg.MATH_ATAN2_HELPURL = 'https://zh.wikipedia.org/wiki/反正切2';
  Blockly.Msg.MATH_ATAN2_TITLE = '点(x:%1,y:%2)的方位角';
  Blockly.Msg.MATH_ATAN2_TOOLTIP = '返回点（X，Y）的反正切值，范围为-180到180度。';
  Blockly.Msg.MATH_CHANGE_HELPURL = 'https://zh.wikipedia.org/wiki/加法';
  Blockly.Msg.MATH_CHANGE_TITLE = '将 %1 增加 %2';
  Blockly.Msg.MATH_CHANGE_TOOLTIP = '为变量“%1”增加一个数值。';
  Blockly.Msg.MATH_CONSTANT_HELPURL = 'https://zh.wikipedia.org/wiki/数学常数';
  Blockly.Msg.MATH_CONSTANT_TOOLTIP = '返回一个常见常量：π (3.141…)、e (2.718…)、φ (1.618…)、平方根 (1.414…)、开平方根 (0.707…)或∞ (无限大)。';
  Blockly.Msg.MATH_CONSTRAIN_HELPURL = 'https://en.wikipedia.org/wiki/Clamping_(graphics)'; // untranslated
  Blockly.Msg.MATH_CONSTRAIN_TITLE = '取 %1 不小于 %2 且不大于 %3 的值';
  Blockly.Msg.MATH_CONSTRAIN_TOOLTIP = '将一个数值限制在两个指定的数值范围（含边界）之间。';
  Blockly.Msg.MATH_DIVISION_SYMBOL = '÷'; // untranslated
  Blockly.Msg.MATH_IS_DIVISIBLE_BY = '可被整除';
  Blockly.Msg.MATH_IS_EVEN = '是偶数';
  Blockly.Msg.MATH_IS_NEGATIVE = '是负数';
  Blockly.Msg.MATH_IS_ODD = '是奇数';
  Blockly.Msg.MATH_IS_POSITIVE = '是正数';
  Blockly.Msg.MATH_IS_PRIME = '是质数';
  Blockly.Msg.MATH_IS_TOOLTIP = '检查一个数值是否是偶数、奇数、质数、自然数、正数、负数或者是否能被某数整除。返回真或假。';
  Blockly.Msg.MATH_IS_WHOLE = '是整数';
  Blockly.Msg.MATH_MODULO_HELPURL = 'https://zh.wikipedia.org/wiki/模除';
  Blockly.Msg.MATH_MODULO_TITLE = '取 %1 ÷ %2 的余数';
  Blockly.Msg.MATH_MODULO_TOOLTIP = '返回这两个数字相除后的余数。';
  Blockly.Msg.MATH_INTEGER_DIVISION_TITLE = '取 %1 ÷ %2 的整数商';
  Blockly.Msg.MATH_INTEGER_DIVISION_TOOLTIP = '返回这两个数字相除后的余数。';
  Blockly.Msg.MATH_INTEGER_DIVMOD_TITLE = '取 %1 ÷ %2 的整数商和余数组成的元组';
  Blockly.Msg.MATH_INTEGER_DIVMOD_TOOLTIP = '返回两个数字相除后的整数商和余数组成的元组。';
  Blockly.Msg.MATH_MULTIPLICATION_SYMBOL = '×'; // untranslated
  Blockly.Msg.MATH_NUMBER_HELPURL = 'https://zh.wikipedia.org/wiki/数';
  Blockly.Msg.MATH_NUMBER_TOOLTIP = '一个数值。';
  Blockly.Msg.MATH_ONLIST_HELPURL = ''; // untranslated
  Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE = '取列表元素的平均值';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MAX = '取列表的最大元素';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN = '取列表的中位元素';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MIN = '取列表的最小元素';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MODE = '取列表中元素的众数';
  Blockly.Msg.MATH_ONLIST_OPERATOR_RANDOM = '取列表的随机元素';
  Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV = '取列表中元素的标准差';
  Blockly.Msg.MATH_ONLIST_OPERATOR_SUM = '取列表中元素的和';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE = '返回列表中的数值的平均值。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX = '返回列表中最大值。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN = '返回列表中数值的中位数。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN = '返回列表中最小值。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE = '返回列表中的出现次数最多的项的列表。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_RANDOM = '从列表中返回一个随机的元素。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV = '返回列表的标准差。';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM = '返回列表中的所有数值的和。';
  Blockly.Msg.MATH_ONSET_OPERATOR_SUM = '取集合中元素的和';
  Blockly.Msg.MATH_ONSET_OPERATOR_AVERAGE = '取集合元素的平均值';
  Blockly.Msg.MATH_ONSET_OPERATOR_MAX = '取集合的最大元素';
  Blockly.Msg.MATH_ONSET_OPERATOR_MIN = '取集合的最小元素';
  Blockly.Msg.MATH_ONTUPLE_OPERATOR_SUM = '取元组中元素的和';
  Blockly.Msg.MATH_ONTUPLE_OPERATOR_AVERAGE = '取元组元素的平均值';
  Blockly.Msg.MATH_ONTUPLE_OPERATOR_MAX = '取元组的最大元素';
  Blockly.Msg.MATH_ONTUPLE_OPERATOR_MIN = '取元组的最小元素';
  Blockly.Msg.MATH_ONTWO_HELPURL = ''; // untranslated
  Blockly.Msg.MATH_ONTWO_OPERATOR_AVERAGE = '取两项的平均值';
  Blockly.Msg.MATH_ONTWO_OPERATOR_MAX = '取两项中较大值';
  Blockly.Msg.MATH_ONTWO_OPERATOR_MIN = '取两项中较最小值';
  Blockly.Msg.MATH_ONTWO_TOOLTIP_AVERAGE = '返回列表中的数值的平均值。';
  Blockly.Msg.MATH_ONTWO_TOOLTIP_MAX = '返回列表中最大值。';
  Blockly.Msg.MATH_ONTWO_TOOLTIP_MIN = '返回列表中最小值。';
  Blockly.Msg.MATH_POWER_SYMBOL = '^'; // untranslated
  Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL = 'https://zh.wikipedia.org/wiki/随机数生成器';
  Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM = '随机小数';
  Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP = '返回一个介于0.0到1.0之间（含边界）的随机数。';
  Blockly.Msg.MATH_RANDOM_INT_HELPURL = 'https://zh.wikipedia.org/wiki/随机数生成器';
  Blockly.Msg.MATH_RANDOM_INT_TITLE = '从 %1 到 %2 范围内的随机整数';
  Blockly.Msg.MATH_RANDOM_INT_TOOLTIP = '返回一个限制在两个指定数值的范围（含边界）之间的随机整数。';
  Blockly.Msg.MATH_ROUND_HELPURL = 'https://zh.wikipedia.org/wiki/数值修约';
  Blockly.Msg.MATH_ROUND_OPERATOR_ROUND = '四舍五入';
  Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = '向下舍入';
  Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP = '向上舍入';
  Blockly.Msg.MATH_ROUND_TOOLTIP = '数字向上或向下舍入。';
  Blockly.Msg.MATH_SINGLE_HELPURL = 'https://zh.wikipedia.org/wiki/平方根';
  Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE = '绝对值';
  Blockly.Msg.MATH_SINGLE_OP_ROOT = '根号';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS = '返回一个数值的绝对值。';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP = '返回一个数值的e次幂。';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_LN = '返回一个数值的自然对数。';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10 = '返回一个数值的以10为底的对数。';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG = '返回一个数值的相反数。';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10 = '返回一个数值的10次幂。';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT = '返回一个数的平方根。';
  Blockly.Msg.MATH_SUBTRACTION_SYMBOL = '-'; // untranslated
  Blockly.Msg.MATH_TRIG_ACOS = 'acos'; // untranslated
  Blockly.Msg.MATH_TRIG_ASIN = 'asin'; // untranslated
  Blockly.Msg.MATH_TRIG_ATAN = 'atan'; // untranslated
  Blockly.Msg.MATH_TRIG_COS = 'cos'; // untranslated
  Blockly.Msg.MATH_TRIG_HELPURL = 'https://zh.wikipedia.org/wiki/三角函数';
  Blockly.Msg.MATH_TRIG_SIN = 'sin'; // untranslated
  Blockly.Msg.MATH_TRIG_TAN = 'tan'; // untranslated
  Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS = '返回一个数值的反余弦值。';
  Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN = '返回一个数值的反正弦值。';
  Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN = '返回一个数值的反正切值。';
  Blockly.Msg.MATH_TRIG_TOOLTIP_COS = '返回指定角度的余弦值(非弧度）。';
  Blockly.Msg.MATH_TRIG_TOOLTIP_SIN = '返回指定角度的正弦值(非弧度）。';
  Blockly.Msg.MATH_TRIG_TOOLTIP_TAN = '返回指定角度的正切值(非弧度）。';
  Blockly.Msg.MATH_BITWISE_AND_SYMBOL = '按位与';
  Blockly.Msg.MATH_BITWISE_OR_SYMBOL = '按位或';
  Blockly.Msg.MATH_BITWISE_XOR_SYMBOL = '按位异或';
  Blockly.Msg.MATH_BITWISE_LEFT_SHIFT_SYMBOL = '左移';
  Blockly.Msg.MATH_BITWISE_RIGHT_SHIFT_SYMBOL = '右移';
  Blockly.Msg.MATH_BITWISE_NOT = '按位取反%1';
  Blockly.Msg.MATH_RADIX_VALUE = '将整数 %1';
  Blockly.Msg.MATH_RADIX_OPTIONS = '转为 %2 前缀的 %1 字符串形式';
  Blockly.Msg.MATH_RADIX_BIN = '二进制';
  Blockly.Msg.MATH_RADIX_OCT = '八进制';
  Blockly.Msg.MATH_RADIX_HEX = '十六进制';
  Blockly.Msg.MATH_RADIX_WITH_PREFIX = '带有';
  Blockly.Msg.MATH_RADIX_WITHOUT_PREFIX = '不带有';
  Blockly.Msg.NEW_COLOUR_VARIABLE = '创建颜色变量...';
  Blockly.Msg.NEW_NUMBER_VARIABLE = '创建数字变量...';
  Blockly.Msg.NEW_STRING_VARIABLE = '创建字符串变量...';
  Blockly.Msg.NEW_VARIABLE = '创建变量...';
  Blockly.Msg.NEW_VARIABLE_TITLE = '新变量的名称：';
  Blockly.Msg.NEW_VARIABLE_TYPE_TITLE = '新变量的类型：';
  Blockly.Msg.VARIABLE_DELETE = '删除';
  Blockly.Msg.ORDINAL_NUMBER_SUFFIX = '的';
  Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS = '允许声明';
  Blockly.Msg.PROCEDURES_BEFORE_PARAMS = '并使用传入的参数';
  Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL = 'https://zh.wikipedia.org/wiki/子程序';
  Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP = '运行用户定义的函数“%1”。';
  Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL = 'https://zh.wikipedia.org/wiki/子程序';
  Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP = '运行用户定义的函数“%1”，并使用它的输出值。';
  Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS = '并传参数';
  Blockly.Msg.PROCEDURES_CREATE_DO = '创建“%1”';
  Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = '描述该功能...';
  Blockly.Msg.PROCEDURES_DEFNORETURN_DO = '-';
  Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL = 'https://zh.wikipedia.org/wiki/子程序';
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = '函数名';
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = '定义';
  Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP = '创建一个不带输出值的函数。';
  Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL = 'https://zh.wikipedia.org/wiki/子程序';
  Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = '返回';
  Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP = '创建一个有输出值的函数。';
  Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING = '警告：此函数具有重复参数。';
  Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF = '突出显示函数定义';
  Blockly.Msg.PROCEDURES_IFRETURN_HELPURL = 'http://c2.com/cgi/wiki?GuardClause';
  Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP = '如果值为真，则返回第二个值。';
  Blockly.Msg.PROCEDURES_IFRETURN_WARNING = '警告：这个块只能在函数内部使用。';
  Blockly.Msg.PROCEDURES_MUTATORARG_TITLE = '参数：';
  Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP = '添加函数输入。';
  Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE = '函数参数';
  Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP = '添加、移除或重新排此函数的参数。';
  Blockly.Msg.REDO = '重做';
  Blockly.Msg.REMOVE_COMMENT = '删除注释';
  Blockly.Msg.RENAME_VARIABLE = '重命名变量...';
  Blockly.Msg.RENAME_VARIABLE_TITLE = '将所有“%1”变量重命名为:';
  Blockly.Msg.TEXT_APPEND_HELPURL = 'https://github.com/google/blockly/wiki/Text#text-modification'; // untranslated
  Blockly.Msg.TEXT_APPEND_TITLE = '向%1附加字符串%2';
  Blockly.Msg.TEXT_APPEND_TOOLTIP = '将一些字符串追加到变量“%1”里。';
  Blockly.Msg.TEXT_CHANGECASE_HELPURL = 'https://github.com/google/blockly/wiki/Text#adjusting-text-case'; // untranslated
  Blockly.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE = '转为全小写';
  Blockly.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE = '转为首字母大写';
  Blockly.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE = '转为全大写';
  Blockly.Msg.TEXT_CHANGECASE_TOOLTIP = '用不同的大小写模式复制并返回这段文字。';
  Blockly.Msg.TEXT_CHARAT_FIRST = '获取首个';
  Blockly.Msg.TEXT_CHARAT_FROM_END = '获取下标为负';
  Blockly.Msg.TEXT_CHARAT_FROM_START = '获取下标为';
  Blockly.Msg.TEXT_CHARAT_HELPURL = 'https://github.com/google/blockly/wiki/Text#extracting-text'; // untranslated
  Blockly.Msg.TEXT_CHARAT_LAST = '获取最后一个';
  Blockly.Msg.TEXT_CHARAT_RANDOM = '获取随机位置的';
  Blockly.Msg.TEXT_CHARAT_TAIL = '字符';
  Blockly.Msg.TEXT_CHARAT_TITLE = '在字符串 %1 里 %2';
  Blockly.Msg.TEXT_CHARAT_TOOLTIP = '返回位于指定位置的字母。';
  Blockly.Msg.TEXT_COUNT_HELPURL = 'https://github.com/google/blockly/wiki/Text#counting-substrings';
  Blockly.Msg.TEXT_COUNT_MESSAGE0 = '计算%1在%2里出现的次数';
  Blockly.Msg.TEXT_COUNT_TOOLTIP = '计算在一段字符串中，某个子字符串重复出现了多少次。';
  Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP = '将一个项添加到字符串中。';
  Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN = '加入';
  Blockly.Msg.TEXT_CREATE_JOIN_TOOLTIP = '添加、移除或重新排列各节来重新配置这个字符串。';
  Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END = '字符到下标为负';
  Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START = '字符到下标为';
  Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST = '字符到最后一个的';
  Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL = 'https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text'; // untranslated
  Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT = '从字符串';
  Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST = '从首个';
  Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END = '从下标为负';
  Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START = '从下标为';
  Blockly.Msg.TEXT_GET_SUBSTRING_TAIL = '字符取得子字符串';
  Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP = '返回字符串中指定的一部分。';
  Blockly.Msg.TEXT_INDEXOF_HELPURL = 'https://github.com/google/blockly/wiki/Text#finding-text'; // untranslated
  Blockly.Msg.TEXT_INDEXOF_OPERATOR_FIRST = '寻找第一次出现的字符串';
  Blockly.Msg.TEXT_INDEXOF_OPERATOR_LAST = '寻找最后一次出现的字符串';
  Blockly.Msg.TEXT_INDEXOF_TITLE = '在字符串 %1 里 %2  %3';
  Blockly.Msg.TEXT_INDEXOF_TOOLTIP = '返回第一个字符串在第二个字符串中的第一/最后一个匹配项的起始位置。如果未找到，则返回%1。';
  Blockly.Msg.TEXT_INPUT_TITLE = '获得输入';
  Blockly.Msg.TEXT_INPUT_PROMPT_TITLE = '询问 %1 并获得输入';
  Blockly.Msg.TEXT_INPUT_TOOLTIP = '插入一个 input 函数用于输入';
  Blockly.Msg.TEXT_ISEMPTY_HELPURL = 'https://github.com/google/blockly/wiki/Text#checking-for-empty-text'; // untranslated
  Blockly.Msg.TEXT_ISEMPTY_TITLE = '%1是空字符串';
  Blockly.Msg.TEXT_ISEMPTY_TOOLTIP = '如果给定的字符串为空，则返回真。';
  Blockly.Msg.TEXT_JOIN_HELPURL = 'https://github.com/google/blockly/wiki/Text#text-creation'; // untranslated
  Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = '得到如下字符串的连接结果';
  Blockly.Msg.TEXT_JOIN_TOOLTIP = '通过串起任意数量的项以建立一段字符串。';
  Blockly.Msg.TEXT_LENGTH_HELPURL = 'https://github.com/google/blockly/wiki/Text#text-modification'; // untranslated
  Blockly.Msg.TEXT_LENGTH_TITLE = '取 %1 的长度';
  Blockly.Msg.TEXT_LENGTH_TOOLTIP = '返回给定字符串的字母数（包括空格）。';
  Blockly.Msg.TEXT_PRINT_HELPURL = 'https://github.com/google/blockly/wiki/Text#printing-text'; // untranslated
  Blockly.Msg.TEXT_PRINT_TITLE = '输出%1';
  Blockly.Msg.TEXT_PRINT_TOOLTIP = '输出指定的文字、数字或其他值。';
  Blockly.Msg.TEXT_PROMPT_HELPURL = 'https://github.com/google/blockly/wiki/Text#getting-input-from-the-user'; // untranslated
  Blockly.Msg.TEXT_PROMPT_TOOLTIP_NUMBER = '要求用户输入数字。';
  Blockly.Msg.TEXT_PROMPT_TOOLTIP_TEXT = '要求用户输入一些字符串。';
  Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER = '要求输入数字，并显示提示消息';
  Blockly.Msg.TEXT_PROMPT_TYPE_TEXT = '要求输入字符串，并显示提示消息';
  Blockly.Msg.TEXT_REPLACE_HELPURL = 'https://github.com/google/blockly/wiki/Text#replacing-substrings';
  Blockly.Msg.TEXT_REPLACE_MESSAGE0 = '在%3中，将%1替换为%2';
  Blockly.Msg.TEXT_REPLACE_TOOLTIP = '在一段字符串中，将出现过的子字符串都替换掉。';
  Blockly.Msg.TEXT_REVERSE_HELPURL = 'https://github.com/google/blockly/wiki/Text#reversing-text';
  Blockly.Msg.TEXT_REVERSE_MESSAGE0 = '翻转字符串%1';
  Blockly.Msg.TEXT_REVERSE_TOOLTIP = '将字符串中各个字符的顺序倒转。';
  Blockly.Msg.TEXT_TEXT_HELPURL = 'https://zh.wikipedia.org/wiki/字符串';
  Blockly.Msg.TEXT_TEXT_TOOLTIP = '一个字、词语或一行字符串。';
  Blockly.Msg.TEXT_TRIM_HELPURL = 'https://github.com/google/blockly/wiki/Text#trimming-removing-spaces'; // untranslated
  Blockly.Msg.TEXT_TRIM_OPERATOR_BOTH = '消除其两侧的空白';
  Blockly.Msg.TEXT_TRIM_OPERATOR_LEFT = '消除其左侧的空白';
  Blockly.Msg.TEXT_TRIM_OPERATOR_RIGHT = '消除其右侧的空白';
  Blockly.Msg.TEXT_TRIM_TOOLTIP = '从某一端或同时从两端删除多余的空白，并返回这段文字的一个副本。';
  Blockly.Msg.TEXT_SPLIT_TITLE = '把字符串 %1 按 %2 分割为列表';
  Blockly.Msg.TEXT_SPLIT_TOOLTIP = '通过指定分隔符对字符串进行切片';
  Blockly.Msg.TEXT_CONCAT_TITLE = '连接 %1 和 %2 成新字符串';
  Blockly.Msg.TEXT_CONCAT_TOOLTIP = '将两个字符串连接在一起';
  Blockly.Msg.TEXT_REPEAT_TITLE = '重复 %1 字符串 %2 次作为新字符串';
  Blockly.Msg.TEXT_REPEAT_TOOLTIP = '将给定字符串重复指定次数作为新字符串';
  Blockly.Msg.TEXT_ORD_TITLE = '获得字符 %1 的整数表示';
  Blockly.Msg.TEXT_ORD_TOOLTIP = '返回给定字符的整数表示';
  Blockly.Msg.TEXT_CHR_TITLE = '获得整数 %1 对应的字符';
  Blockly.Msg.TEXT_CHR_TOOLTIP = '返回给定整数对应的字符表示';
  Blockly.Msg.TODAY = '今天';
  Blockly.Msg.UNDO = '撤销';
  Blockly.Msg.UNNAMED_KEY = '匿名';
  Blockly.Msg.VARIABLES_DEFAULT_NAME = '变量';
  Blockly.Msg.VARIABLES_GET_CREATE_SET = '创建“设定%1”';
  Blockly.Msg.VARIABLES_GET_HELPURL = 'https://github.com/google/blockly/wiki/Variables#get'; // untranslated
  Blockly.Msg.VARIABLES_GET_TOOLTIP = '返回此变量的值。';
  Blockly.Msg.VARIABLES_SET = '赋值 %1 为 %2';
  Blockly.Msg.VARIABLES_SET_CREATE_GET = '创建“获得%1”';
  Blockly.Msg.VARIABLES_SET_HELPURL = 'https://github.com/google/blockly/wiki/Variables#set'; // untranslated
  Blockly.Msg.VARIABLES_SET_TOOLTIP = '设置此变量，以使它和输入值相等。';
  Blockly.Msg.VARIABLE_ALREADY_EXISTS = '名字叫“%1”的变量已经存在了。';
  Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE = '名字叫“%1”的变量已经有了另一个类型：“%2”。';
  Blockly.Msg.VARIABLES_AND = '与';
  Blockly.Msg.VARIABLES_SET_VALUE = '赋值';
  Blockly.Msg.VARIABLES_TOBE = '为';
  Blockly.Msg.VARIABLES_GLOBAL = '将';
  Blockly.Msg.VARIABLES_GLOBALS = '将';
  Blockly.Msg.VARIABLES_AVAILABLE = '设为全局可用';
  Blockly.Msg.WORKSPACE_ARIA_LABEL = 'Blockly工作区';
  Blockly.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT = '说点什么...';
  Blockly.Msg.CONTROLS_FOREACH_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.CONTROLS_FOR_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF = Blockly.Msg.CONTROLS_IF_MSG_ELSEIF;
  Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = Blockly.Msg.CONTROLS_IF_MSG_ELSE;
  Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = Blockly.Msg.CONTROLS_IF_MSG_IF;
  Blockly.Msg.CONTROLS_IF_MSG_THEN = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.LISTS_GET_INDEX_HELPURL = Blockly.Msg.LISTS_INDEX_OF_HELPURL;
  Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.MATH_CHANGE_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT = Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT;
  Blockly.Msg.PROCEDURES_DEFRETURN_DO = Blockly.Msg.PROCEDURES_DEFNORETURN_DO;
  Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE = Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
  Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE;
  Blockly.Msg.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.TUPLES_CREATE_WITH_CONTAINER_TITLE_ADD = '元组';
  Blockly.Msg.TUPLES_CREATE_EMPTY_TITLE = '创建空元组';
  Blockly.Msg.TUPLES_CREATE_WITH_INPUT_WITH = '使用下列元素创建元组';
  Blockly.Msg.TUPLES_SIZE_TITLE = '取 %1 的元素个数';
  Blockly.Msg.TUPLES_SIZE_TOOLTIP = '返回元组中的元素的个数。';
  Blockly.Msg.TUPLES_ISEMPTY_TITLE = '%1是空元组';
  Blockly.Msg.TUPLES_ISEMPTY_TOOLTIP = '如果元组为空，则返回真。';
  Blockly.Msg.TUPLES_CONCAT_TITLE = '连接 %1 和 %2 成新元组';
  Blockly.Msg.TUPLES_CONCAT_TOOLTIP = '将两个元组连接在一起';
  Blockly.Msg.TUPLES_REPEAT_TITLE = '重复 %1 元组 %2 次作为新元组';
  Blockly.Msg.TUPLES_REPEAT_TOOLTIP = '将给定元组重复指定次数作为新元组';
  Blockly.Msg.TUPLES_GET_INDEX_FIRST = Blockly.Msg.LISTS_GET_INDEX_FIRST;
  Blockly.Msg.TUPLES_GET_INDEX_FROM_END = Blockly.Msg.LISTS_GET_INDEX_FROM_END;
  Blockly.Msg.TUPLES_GET_INDEX_FROM_START = Blockly.Msg.LISTS_GET_INDEX_FROM_START;
  Blockly.Msg.TUPLES_GET_INDEX_GET = Blockly.Msg.LISTS_GET_INDEX_GET;
  Blockly.Msg.TUPLES_GET_INDEX_LAST = Blockly.Msg.LISTS_GET_INDEX_LAST;
  Blockly.Msg.TUPLES_GET_INDEX_RANDOM = Blockly.Msg.LISTS_GET_INDEX_RANDOM;
  Blockly.Msg.TUPLES_GET_INDEX_TAIL = Blockly.Msg.LISTS_GET_INDEX_TAIL;
  Blockly.Msg.TUPLES_GET_INDEX_INPUT_IN_TUPLE = Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_END_FROM_END = Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_END_FROM_START = Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_END_LAST = Blockly.Msg.LISTS_GET_SUBLIST_END_LAST;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_START_FIRST = Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_START_FROM_END = Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_START_FROM_START = Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_TAIL = '元素构成新元组';
  Blockly.Msg.TUPLES_GET_SUBTUPLE_INPUT_IN_TUPLE = Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST;
  Blockly.Msg.TUPLES_GET_SUBTUPLE_STEP = Blockly.Msg.LISTS_GET_SUBLIST_STEP;
  Blockly.Msg.TEXT_GET_SUBSTRING_STEP = Blockly.Msg.
      LISTS_GET_SUBLIST_STEP;
  Blockly.Msg.DICTS_PAIR = '键 %1: 值 %2';
  Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE = '键值对';
  Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = '字典';
  Blockly.Msg.DICTS_CREATE_EMPTY_TITLE = '创建空字典';
  Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH = '使用下列键值对创建字典';
  Blockly.Msg.DICTS_SIZE_TITLE = '取 %1 的键值对个数';
  Blockly.Msg.DICTS_SIZE_TOOLTIP = '返回字典中的键值对个数。';
  Blockly.Msg.DICTS_GET_KEY_TITLE = '从 %1 取出键是 %2 的键值对中的值';
  Blockly.Msg.DICTS_GET_KEY_TOOLTIP = '返回字典中给定键对应的键值对中的值。';
  Blockly.Msg.DICTS_SET_KEY_TITLE = '在%1 中设置键是 %2 的键值对中的值为 %3';
  Blockly.Msg.DICTS_SET_KEY_TOOLTIP = '设置字典中给定键对应的键值对中的值。';
  Blockly.Msg.DICTS_POP_TITLE = '移除 %1 中键为 %2 的键值对并返回其中的值';
  Blockly.Msg.DICTS_POP_TOOLTIP = '返回字典中给定键对应的键值对的值并移除该键值对。';
  Blockly.Msg.BINOPS_AUGASSIGN_PREPOSITION = '以';
  Blockly.Msg.ITERATOR_CONTAINER_TITLE = '可迭代对象';
  Blockly.Msg.ITERATOR_ITEM_TITLE = '子元素';
  Blockly.Msg.COMPREHENSION_CONTAINER_TITLE = '推导式';
  Blockly.Msg.COMPREHENSION_FOR_TITLE = '迭代器';
  Blockly.Msg.COMPREHENSION_IF_TITLE = '判断条件';
  Blockly.Msg.COMPREHENSION_DICTS_CREATE_TITLE = '创建字典推导式';
  Blockly.Msg.COMPREHENSION_LISTS_CREATE_TITLE = '创建列表推导式';
  Blockly.Msg.COMPREHENSION_SETS_CREATE_TITLE = '创建集合推导式';
  Blockly.Msg.GENERATOR_EXPRESSION_CREATE_TITLE = '创建生成器表达式';
  Blockly.Msg.IF_EXPRESSION_CREATE_TITLE = '如果 %2 成立，则返回 %1, 否则返回%3';
  Blockly.Msg.BREAKPOINT_CREATE_TITLE = '断点';
  Blockly.Msg.TRY_CREATE_TITLE = '姑妄行此';
  Blockly.Msg.EXCEPT_AS_CREATE_TITLE = '如事不谐岂 %1 之祸欤名之曰 %2';
  Blockly.Msg.UNARYOPS_UADD = '取正';
  Blockly.Msg.UNARYOPS_USUB = '取负';
  Blockly.Msg.UNARYOPS_NOT = '非';
  Blockly.Msg.UNARYOPS_INVERT = '按位取反';
  Blockly.Msg.IMPORT_BLOCK_TITLE = '导入模块';
  Blockly.Msg.IMPORT_FROM_BLOCK_TITLE = '从';
  Blockly.Msg.IMPORT_AS_BLOCK_TITLE = '名之曰';
};
export default globalConst;
