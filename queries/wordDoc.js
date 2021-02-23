const { Document, Media, Table, TableCell, TableRow, VerticalAlign, HorizontalPositionAlign, Paragraph, Packer } = require('docx');
const fs = require('fs');

const doc = new Document();

const table  = new Table({
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

console.log(true)

Packer.toBuffer(doc).then((buffer)=>{
    console.log(buffer);
    fs.writeFileSync("test.docx",buffer);
});