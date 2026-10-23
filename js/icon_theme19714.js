/* V1.9.7.14: lightweight and reversible 3D icon system for major app surfaces. */
(()=>{'use strict';
const icons={calendar:'calendar',projects:'work',work:'work',photos:'camera',stock:'stock',stats:'calendar',finance:'money',notifications:'notification',profile:'settings'};
function addIcon(h,key){if(!h||h.querySelector('.mr3d-app-icon'))return;const img=document.createElement('img');img.className='mr3d-app-icon';img.src='icons3d/ui-'+key+'.svg';img.alt='';img.setAttribute('aria-hidden','true');h.prepend(img);h.classList.add('mr3d-heading')}
function init(){for(const [page,key] of Object.entries(icons)){const heading=document.querySelector('#'+page+' h1, #'+page+' h2');if(heading)addIcon(heading,key)}
const top=document.querySelector('header .top-actions>span:last-child');if(top&&top.textContent.includes('🏡')){top.textContent='';const img=document.createElement('img');img.src='icons3d/ui-home.svg';img.alt='';img.className='mr3d-app-icon';top.append(img)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();