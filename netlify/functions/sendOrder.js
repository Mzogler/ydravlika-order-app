const sg = require('@sendgrid/mail');

exports.handler = async (event) => {
  if(event.httpMethod==='OPTIONS'){
    return {statusCode:200,headers:cors(),body:'ok'};
  }
  if(event.httpMethod!=='POST'){
    return {statusCode:405,headers:cors(),body:'Only POST allowed'};
  }
  try{
    const {items}=JSON.parse(event.body||'{}');
    if(!items||!items.length) return {statusCode:400,headers:cors(),body:'No items'};
    sg.setApiKey(process.env.SENDGRID_API_KEY);
    const txt=items.map((x,i)=>`${i+1}. ${x.desc} – ${x.cat} – ${x.qty}`).join('\\n');
    await sg.send({
      to:process.env.TO_EMAIL,
      from:process.env.FROM_EMAIL||'no-reply@example.com',
      subject:'Παραγγελία Υδραυλικών',
      text:txt
    });
    return {statusCode:200,headers:cors(),body:'Email sent'};
  }catch(e){return {statusCode:500,headers:cors(),body:'Error '+e.message};}
};

function cors(){
  return {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS'};
}
