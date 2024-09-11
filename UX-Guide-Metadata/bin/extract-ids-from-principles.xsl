<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="/">
        <strings>
            <xsl:apply-templates select="//xhtml:h3[@id]"/>
            <xsl:apply-templates select="//xhtml:aside[@class='example']//*[@id]"/>
        </strings>
    </xsl:template>

    <xsl:template match="xhtml:h3[@id]">
        <string>
            <id><xsl:value-of select="@id"/></id>
            <value><xsl:value-of select="."/></value>
        </string>
    </xsl:template>
    
    <xsl:template match="//xhtml:aside[@class='example']//*[@id]">
        <string>
            <id><xsl:value-of select="@id"/></id>
            <value><xsl:value-of select="."/></value>
        </string>
    </xsl:template>
    
</xsl:stylesheet>
