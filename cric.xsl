<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template  match="/">
        <html>
            <body>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Lastname</th>
                        <th>Age</th>
                        <th>Centuries</th>
                    </tr>

                    <xsl:for-each select="/cricket/batsman">
                        <tr>
                        <td><xsl:value-of select="name"></xsl:value-of></td>
                        <td><xsl:value-of select="lastname"></xsl:value-of></td>
                        <td><xsl:value-of select="age"></xsl:value-of></td>
                        <td><xsl:value-of select="century"></xsl:value-of></td>
                    </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>