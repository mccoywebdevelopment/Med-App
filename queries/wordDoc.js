let { Document, Media, Table, TableCell, TableRow, VerticalAlign, HorizontalPositionAlign, Paragraph, Packer } = require('docx');
let fs = require('fs');

let doc = new Document();

let table  = new Table({
    rows:[
        new TableRow({
            children: [
                new TableCell({
                    children:[new Paragraph({
                        text:"test"
                    })]
                })
            ]
        }),
        new TableRow({
            children: [
                new TableCell({
                    children:[new Paragraph({
                        text:"test"
                    })]
                })
            ]
        })
    ]
})

doc.addSection({
    children: [
        table
    ]
});


Packer.toBuffer(doc).then((buffer)=>{
    fs.writeFileSync("test.docx",buffer);
});