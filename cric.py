from lxml import etree

file='crc.xml'
tree=etree.parse(file)

cricketer=tree.xpath('//cricket/batsman')

for cric in cricketer:
    name=cric.xpath('name/text()')[0]
    century=cric.xpath('century/text()')[0]
    print(name)
    print(century)