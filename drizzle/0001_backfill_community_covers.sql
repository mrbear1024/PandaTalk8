update communities
set
  cover = '/assets/communities/ai-learning-circle.png',
  description = '熊老板的 AI 学习圈是知识星球社群，持续分享 AI 工具、工作流、产品案例和创作者实践，适合想把 AI 真正用进工作和产品里的人。',
  join_instructions = '微信扫码加入知识星球「熊老板的 AI 学习圈」，或搜索公众号 PandaTalk8 发送「AI学习圈」获取加入方式。',
  status = 'published'
where slug = 'ai-learning-circle';

update communities
set
  cover = '/assets/communities/x-cold-start.png',
  description = 'X 冷启动成长群是知识星球低价入门社群，帮助刚开始做 X 的人完成账号定位、第一批内容、早期互动和冷启动节奏。',
  join_instructions = '微信扫码加入知识星球「X 冷启动成长群」，或搜索公众号 PandaTalk8 发送「冷启动」获取加入方式。',
  status = 'published'
where slug = 'x-cold-start';

notify pgrst, 'reload schema';
