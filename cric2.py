from lxml import etree

xm='crc.xml'
xs='cric.xsl'

xml=etree.parse(xm)
xs=etree.parse(xs)

trans=etree.XSLT(xs)

result=trans(xml)


html_content = str(result)

output_file = 'output.html'
with open(output_file, 'w') as file:
    file.write(html_content)
