/**
 * Hexo 角色卡片 Tag 插件 (全 Markdown 版)
 */
hexo.extend.tag.register('character', function(args, content) {
  const cleanArg = (str) => (str || '').trim().replace(/^['"]|['"]$/g, '');

  const avatar = cleanArg(args[0]);
  const name = cleanArg(args[1]);
  const quote = cleanArg(args[2]);

  let basicMd = '';
  let detailsMd = content;

  if (content.includes('<!-- details -->')) {
    const parts = content.split('<!-- details -->');
    basicMd = parts[0].trim();
    detailsMd = parts[1].trim();
  } else {
    detailsMd = content.trim();
  }

  // 基础信息和详细介绍两部分，都直接使用 Markdown 渲染
  const basicHtml = hexo.render.renderSync({ text: basicMd, engine: 'markdown' });
  const detailsHtml = hexo.render.renderSync({ text: detailsMd, engine: 'markdown' });

  const rawHtml = `
<div class="character-card">
  <div class="character-header">
    <div class="character-avatar">
      <img src="${avatar}" alt="${name}">
    </div>
    <div class="character-basic">
      ${quote ? `<p class="character-quote">${quote}</p>` : ''}
      ${basicHtml}
    </div>
  </div>
  <div class="character-details">
    ${detailsHtml}
  </div>
</div>`;

  return rawHtml.replace(/\n\s*\n/g, '\n');
}, { ends: true });