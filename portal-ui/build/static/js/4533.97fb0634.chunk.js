"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[4533],{8235:function(e,n,t){t(50390);var r=t(86509),i=t(4285),o=t(25594),a=t(62559);n.Z=(0,i.Z)((function(e){return(0,r.Z)({root:{border:"1px solid #E2E2E2",borderRadius:2,backgroundColor:"#FBFAFA",paddingLeft:25,paddingTop:31,paddingBottom:21,paddingRight:30},leftItems:{fontSize:16,fontWeight:"bold",marginBottom:15,display:"flex",alignItems:"center","& .min-icon":{marginRight:15,height:28,width:38}},helpText:{fontSize:16,paddingLeft:5}})}))((function(e){var n=e.classes,t=e.iconComponent,r=e.title,i=e.help;return(0,a.jsx)("div",{className:n.root,children:(0,a.jsxs)(o.ZP,{container:!0,children:[(0,a.jsxs)(o.ZP,{item:!0,xs:12,className:n.leftItems,children:[t,r]}),(0,a.jsx)(o.ZP,{item:!0,xs:12,className:n.helpText,children:i})]})})}))},70758:function(e,n,t){var r=t(18489),i=t(36222),o=t(83738),a=(t(50390),t(86509)),s=t(4285),l=t(95467),c=t(94187),d=t(44977),u=t(62559),p=["classes","children","variant","tooltip"];n.Z=(0,s.Z)((function(e){return(0,a.Z)({root:{padding:8,marginLeft:8,borderWidth:1,borderColor:"#696969",color:"#696969",borderStyle:"solid",borderRadius:3,"& .min-icon":{width:20},"& .MuiTouchRipple-root span":{backgroundColor:e.palette.primary.main,borderRadius:3,opacity:.3},"&:disabled":{color:"#EBEBEB",borderColor:"#EBEBEB"}},contained:{borderColor:e.palette.primary.main,background:e.palette.primary.main,color:"white","& .MuiTouchRipple-root span":{backgroundColor:e.palette.primary.dark,borderRadius:3,opacity:.3},"&:hover":{backgroundColor:e.palette.primary.light,color:"#FFF"}}})}))((function(e){var n=e.classes,t=e.children,a=e.variant,s=void 0===a?"outlined":a,m=e.tooltip,h=(0,o.Z)(e,p),v=(0,u.jsx)(l.Z,(0,r.Z)((0,r.Z)({},h),{},{className:(0,d.Z)(n.root,(0,i.Z)({},n.contained,"contained"===s)),children:t}));return m&&""!==m?(0,u.jsx)(c.Z,{title:m,children:(0,u.jsx)("span",{children:v})}):v}))},14533:function(e,n,t){t.r(n),t.d(n,{default:function(){return M}});var r=t(35531),i=t(23430),o=t(18489),a=t(50390),s=t(34424),l=t(86509),c=t(4285),d=t(25594),u=t(12066),p=t(65771),m=t(38342),h=t.n(m),v=t(57074),f=t(63548),Z=t(44149),b=t(72462),x=t(28948),g=t(43117),y=t(30324),j=t(8174),S=t(18221),E=t(13336),k=t(70758),P=t(8235),C=t(83738),F=t(56805),I=t(66946),L=t(62559),N=["classes","children","label"],z=function(e){e.classes;var n=e.children,t=e.label,r=void 0===t?"":t,i=(0,C.Z)(e,N),s=i;return(0,L.jsxs)(a.Fragment,{children:[(0,L.jsx)(F.Z,{sx:{display:{xs:"none",sm:"none",md:"block"}},children:(0,L.jsx)(I.Z,(0,o.Z)((0,o.Z)({},i),{},{endIcon:n,children:r}))}),(0,L.jsx)(F.Z,{sx:{display:{xs:"block",sm:"block",md:"none"}},children:(0,L.jsx)(k.Z,(0,o.Z)((0,o.Z)({},s),{},{tooltip:r,children:n}))})]})},R=t(37882),D=(0,R.Z)(a.lazy((function(){return Promise.all([t.e(5444),t.e(3698)]).then(t.bind(t,93698))}))),T=(0,R.Z)(a.lazy((function(){return Promise.all([t.e(5444),t.e(1971)]).then(t.bind(t,1971))}))),w={setErrorSnackMessage:Z.Ih,selectDrive:function(e){return{type:g.J,driveName:e}}},A=(0,s.$j)(null,w),M=(0,c.Z)((function(e){return(0,l.Z)((0,o.Z)((0,o.Z)((0,o.Z)({tableWrapper:{height:"calc(100vh - 275px)"},linkItem:{display:"default",color:e.palette.info.main,textDecoration:"none","&:hover":{textDecoration:"underline",color:"#000"}}},b.OR),b.qg),(0,b.Bz)(e.spacing(4))))}))(A((function(e){var n=e.classes,t=(e.selectDrive,e.setErrorSnackMessage),s=(0,a.useState)([]),l=(0,i.Z)(s,2),c=l[0],m=l[1],Z=(0,a.useState)(""),b=(0,i.Z)(Z,2),g=b[0],C=b[1],F=(0,a.useState)([]),I=(0,i.Z)(F,2),N=I[0],R=I[1],w=(0,a.useState)(!0),A=(0,i.Z)(w,2),M=A[0],O=A[1],B=(0,a.useState)(!1),K=(0,i.Z)(B,2),V=K[0],W=K[1],_=(0,a.useState)(!1),H=(0,i.Z)(_,2),G=H[0],q=H[1],J=(0,a.useState)([]),U=(0,i.Z)(J,2),$=U[0],Q=U[1],X=(0,a.useState)(!1),Y=(0,i.Z)(X,2),ee=Y[0],ne=Y[1],te=(0,a.useState)([]),re=(0,i.Z)(te,2),ie=re[0],oe=re[1],ae=(0,a.useState)(!0),se=(0,i.Z)(ae,2),le=se[0],ce=se[1];(0,a.useEffect)((function(){M&&y.Z.invoke("GET","/api/v1/direct-csi/drives").then((function(e){var n=h()(e,"drives",[]);n||(n=[]),(n=n.map((function(e){var n=(0,o.Z)({},e);return n.joinName="".concat(n.node,":").concat(n.drive),n}))).sort((function(e,n){return e.drive>n.drive?1:e.drive<n.drive?-1:0})),m(n),O(!1),ce(!1)})).catch((function(e){O(!1),ce(!0)}))}),[M,t,le]);var de=[{type:"format",onClick:function(e){oe([e]),q(!1),W(!0)},sendOnlyId:!0}],ue=c.filter((function(e){return e.drive.includes(g)}));return(0,L.jsxs)(a.Fragment,{children:[V&&(0,L.jsx)(D,{closeFormatModalAndRefresh:function(e,n){W(!1),e&&(n&&n.length>0&&(Q(n),ne(!0)),O(!0),R([]))},deleteOpen:V,allDrives:G,drivesToFormat:ie}),ee&&(0,L.jsx)(T,{errorsList:$,open:ee,onCloseFormatErrorsList:function(){ne(!1)}}),(0,L.jsx)("h1",{className:n.sectionTitle,children:"Local Drives"}),(0,L.jsxs)(d.ZP,{item:!0,xs:12,className:n.actionsTray,children:[(0,L.jsx)(u.Z,{placeholder:"Search Drives",className:n.searchField,id:"search-resource",label:"",InputProps:{disableUnderline:!0,startAdornment:(0,L.jsx)(p.Z,{position:"start",children:(0,L.jsx)(E.default,{})})},onChange:function(e){C(e.target.value)},disabled:le,variant:"standard"}),(0,L.jsx)(k.Z,{color:"primary","aria-label":"Refresh Tenant List",onClick:function(){O(!0)},disabled:le,size:"large",children:(0,L.jsx)(S.default,{})}),(0,L.jsx)(z,{variant:"contained",color:"primary",disabled:N.length<=0||le,onClick:function(){N.length>0&&(oe(N),q(!1),W(!0))},label:"Format Selected Drives",children:(0,L.jsx)(v.Z,{})}),(0,L.jsx)(z,{variant:"contained",color:"primary",label:"Format All Drives",onClick:function(){var e=c.map((function(e){return"".concat(e.node,":").concat(e.drive)}));q(!0),oe(e),W(!0)},disabled:le,children:(0,L.jsx)(f.dt,{})})]}),(0,L.jsx)(d.ZP,{item:!0,xs:12,children:le&&!M?(0,L.jsx)(P.Z,{title:"Leverage locally attached drives",iconComponent:(0,L.jsx)(f.id,{}),help:(0,L.jsxs)(a.Fragment,{children:["We can automatically provision persistent volumes (PVs) on top locally attached drives on your Kubernetes nodes by leveraging Direct-CSI.",(0,L.jsx)("br",{}),(0,L.jsx)("br",{}),"For more information"," ",(0,L.jsx)("a",{href:"https://github.com/minio/direct-csi",rel:"noreferrer",target:"_blank",className:n.linkItem,children:"Visit Direct-CSI Documentation"})]})}):(0,L.jsx)(j.Z,{itemActions:de,columns:[{label:"Drive",elementKey:"drive"},{label:"Capacity",elementKey:"capacity",renderFunction:x.ae},{label:"Allocated",elementKey:"allocated",renderFunction:x.ae},{label:"Volumes",elementKey:"volumes"},{label:"Node",elementKey:"node"},{label:"Status",elementKey:"status"}],onSelect:function(e){var n=e.target,t=n.value,i=n.checked,o=(0,r.Z)(N);return i?o.push(t):o=o.filter((function(e){return e!==t})),R(o),o},selectedItems:N,isLoading:M,records:ue,customPaperHeight:n.tableWrapper,entityName:"Drives",idField:"joinName"})})]})})))},57074:function(e,n,t){var r=t(64119);n.Z=void 0;var i=r(t(66830)),o=t(62559),a=(0,i.default)((0,o.jsx)("path",{d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"}),"Group");n.Z=a},65771:function(e,n,t){t.d(n,{Z:function(){return y}});var r=t(36222),i=t(1048),o=t(32793),a=t(50390),s=t(44977),l=t(50076),c=t(91442),d=t(35477),u=t(14478),p=t(23060),m=t(8208),h=t(10594);function v(e){return(0,h.Z)("MuiInputAdornment",e)}var f=(0,t(43349).Z)("MuiInputAdornment",["root","filled","standard","outlined","positionStart","positionEnd","disablePointerEvents","hiddenLabel","sizeSmall"]),Z=t(15573),b=t(62559),x=["children","className","component","disablePointerEvents","disableTypography","position","variant"],g=(0,m.ZP)("div",{name:"MuiInputAdornment",slot:"Root",overridesResolver:function(e,n){var t=e.ownerState;return[n.root,n["position".concat((0,c.Z)(t.position))],!0===t.disablePointerEvents&&n.disablePointerEvents,n[t.variant]]}})((function(e){var n=e.theme,t=e.ownerState;return(0,o.Z)({display:"flex",height:"0.01em",maxHeight:"2em",alignItems:"center",whiteSpace:"nowrap",color:n.palette.action.active},"filled"===t.variant&&(0,r.Z)({},"&.".concat(f.positionStart,"&:not(.").concat(f.hiddenLabel,")"),{marginTop:16}),"start"===t.position&&{marginRight:8},"end"===t.position&&{marginLeft:8},!0===t.disablePointerEvents&&{pointerEvents:"none"})})),y=a.forwardRef((function(e,n){var t=(0,Z.Z)({props:e,name:"MuiInputAdornment"}),r=t.children,m=t.className,h=t.component,f=void 0===h?"div":h,y=t.disablePointerEvents,j=void 0!==y&&y,S=t.disableTypography,E=void 0!==S&&S,k=t.position,P=t.variant,C=(0,i.Z)(t,x),F=(0,p.Z)()||{},I=P;P&&F.variant,F&&!I&&(I=F.variant);var L=(0,o.Z)({},t,{hiddenLabel:F.hiddenLabel,size:F.size,disablePointerEvents:j,position:k,variant:I}),N=function(e){var n=e.classes,t=e.disablePointerEvents,r=e.hiddenLabel,i=e.position,o=e.size,a=e.variant,s={root:["root",t&&"disablePointerEvents",i&&"position".concat((0,c.Z)(i)),a,r&&"hiddenLabel",o&&"size".concat((0,c.Z)(o))]};return(0,l.Z)(s,v,n)}(L);return(0,b.jsx)(u.Z.Provider,{value:null,children:(0,b.jsx)(g,(0,o.Z)({as:f,ownerState:L,className:(0,s.Z)(N.root,m),ref:n},C,{children:"string"!==typeof r||E?(0,b.jsxs)(a.Fragment,{children:["start"===k?(0,b.jsx)("span",{className:"notranslate",dangerouslySetInnerHTML:{__html:"&#8203;"}}):null,r]}):(0,b.jsx)(d.Z,{color:"text.secondary",children:r})}))})}))},83738:function(e,n,t){function r(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}t.d(n,{Z:function(){return r}})}}]);
//# sourceMappingURL=4533.97fb0634.chunk.js.map