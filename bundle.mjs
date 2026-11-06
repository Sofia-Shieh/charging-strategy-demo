import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const out=path.join(root,'delivery');
fs.mkdirSync(out,{recursive:true});
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
for(const file of ['styles.css','theme-energy.css','content-dense.css','slide-system-health.css','slide-operating-system.css','slide-supply-shares.css','slide-stage-strategy.css','slide-tools-workbench.css','slide-members-merchant.css','slide-pricing-map.css','slide-marketing-trend.css','slide-health-customer.css','slide-collaboration-closing.css','slide-pricing-cases.css','hero-tech.css','presenter-profile.css','slide-opening-bridge.css','opening-transition.css','page-flow.css']){
 const css=fs.readFileSync(path.join(dist,file),'utf8');
 html=html.replace('<link rel="stylesheet" href="'+file+'">',()=>'<style>'+css+'</style>');
}
for(const file of ['notes.js','hero-tech.js','hero-tech-motion.js','slide-system-health.js','slide-operating-system.js','slide-supply-shares.js','slide-stage-strategy.js','slide-tools-workbench.js','slide-members-merchant.js','slide-pricing-map.js','slide-marketing-trend.js','slide-health-customer.js','slide-collaboration-closing.js','slide-pricing-cases.js','slide-opening-bridge.js','opening-transition.js','presenter-profile.js','app.js']){
 let script=fs.readFileSync(path.join(dist,file),'utf8');
 for(const asset of ['segmentation.jpg','pricing.jpg','configuration.jpg']){
  if(!script.includes('assets/'+asset))continue;
  const mime=asset.endsWith('.png')?'image/png':'image/jpeg';
  const uri='data:'+mime+';base64,'+fs.readFileSync(path.join(dist,'assets',asset)).toString('base64');
  script=script.split('assets/'+asset).join(uri);
 }
 html=html.replace('<script src="'+file+'"></script>',()=>'<script>'+script.replaceAll('</script','<\\/script')+'</script>');
}
fs.writeFileSync(path.join(out,'充电业务经营汇报.html'),html);
console.log('Standalone HTML ready: '+path.join(out,'充电业务经营汇报.html'));
