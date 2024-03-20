const puppeteer = require('puppeteer')

async function generatepdf(userdata ,templatepath,outputprefix)

{
    const browser = await puppeteer.launch(
        {
            headless : true
        }
    )
    const page = await browser.newPage()
    try {
        await page.goto(templatepath)
        await page.evaluate((userdata)=>{
            for ( const key in userdata)
            {
                document.querySelector(`[data-user-${key}]`).textContent= userdata[key]
            }
        },userdata)
        const pdfbuffer = await page.pdf({
            format :'A4'
        })
        await browser.close()
        const filename = `${outputprefix}_${userdata.name}.pdf`
        return {
            filename, buffer: pdfbuffer
        }
    }catch (error){
        console.error("error generating pdf:", error)
        await browser.close()
        return null
    }
    
}

const userdata = { name:"ujjawal", email:"ujjawal@gmail.com"}
const templatepath = "http://localhost:5500/index.html"
const outputprefix ="userreport"
generatepdf(userdata , templatepath ,outputprefix)
    .then(pdfdata => {
    if (pdfdata) {
        const fs = require('fs');
        const filePath = `./${pdfdata.filename}`; // Adjust the path as needed
        fs.writeFileSync(filePath, pdfdata.buffer); // Write the PDF buffer to a file
        console.log("PDF generated and saved:", pdfdata.filename);
    } else {
        console.error("PDF generation failed");
    }
});
   /* .then(pdfdata =>{
        if(pdfdata){
            console.log("pdf generated:", pdfdata.filename)
        } else{
            console.error("pdf generation failed")
        }
    })*/