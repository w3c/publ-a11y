<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="/">
        <strings>
            <xsl:apply-templates select="//*[@data-localization-id]"/>
        </strings>
    </xsl:template>
    
    <xsl:template match="//*[@data-localization-id]">
        <string>
            <id><xsl:value-of select="@data-localization-id"/></id>
            <mode><xsl:value-of select="@data-localization-mode"/></mode>
            <value><xsl:value-of select="normalize-space(.)"/></value>
        </string>
    </xsl:template>
    
</xsl:stylesheet>
