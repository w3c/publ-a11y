<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:param name="guidelines"/>
    <xsl:param name="onix"/>
    <xsl:param name="epub"/>
    <xsl:param name="ids-file"/>
    
    <xsl:key name="id-lookup" match="/ids/group/id" use="."/>
    
    <xsl:template match="/">
        <root>
            <metadata>
                <author>W3C Publishing Community Group Accessibility Task Force</author>
                <language>en-US</language>
                <variant>canonical</variant>
                <audience>general</audience>
                <description>Original wording discussed by a large group representing different actors of the English-speaking geographies. It has been improved after proof of concept implementations and panel testers</description>
            </metadata>
            <xsl:for-each select="document($ids-file)/ids/group">
                <xsl:element name="{@name}">
                    <xsl:element name="{@name}-title">
                        <xsl:variable name="id-title" select="concat(@name, '-title')"/>
                        <xsl:value-of select="normalize-space(document($guidelines)//*[@data-localization-id=$id-title][1])"/>
                    </xsl:element>
                    <xsl:for-each select="id[generate-id(.) = generate-id(key('id-lookup', .)[1])]">
                        <xsl:sort select="."/>
                        <xsl:variable name="current-id" select="."/>
                        <xsl:choose>
                            <xsl:when test="not(contains($current-id, '-title'))">
                                <xsl:element name="{$current-id}">
                                    <xsl:element name="compact">
                                        <xsl:variable name="compact">
                                            <xsl:choose>
                                                <xsl:when test="document($guidelines)//*[@data-localization-id=$current-id and @data-localization-mode='compact']">
                                                    <xsl:value-of select="concat('|', document($guidelines)//*[@data-localization-id=$current-id and @data-localization-mode='compact'][1], '|')" />
                                                </xsl:when>
                                                <xsl:when test="document($epub)//*[@id=$current-id]">
                                                    <!--<xsl:value-of select="substring(normalize-space(document($epub)//*[@id=$current-id][1]), 2, string-length(normalize-space(document($epub)//*[@id=$current-id][1])) - 2)"/>-->
                                                    <xsl:value-of select="normalize-space(translate(document($epub)//*[@id=$current-id][1], '&quot;', '|'))"/>
                                                </xsl:when>
                                                <xsl:when test="document($onix)//*[@id=$current-id]">
                                                    <!--<xsl:value-of select="substring(normalize-space(document($onix)//*[@id=$current-id][1]), 2, string-length(normalize-space(document($onix)//*[@id=$current-id][1])) - 2)"/>-->
                                                    <xsl:value-of select="normalize-space(translate(document($onix)//*[@id=$current-id][1], '&quot;', '|'))"/>
                                                </xsl:when>
                                            </xsl:choose>
                                        </xsl:variable>
                                        <xsl:value-of select="normalize-space($compact)"/>
                                    </xsl:element>
                                    <xsl:element name="descriptive">
                                        <xsl:variable name="descriptive">
                                            <xsl:value-of select="concat('|', document($guidelines)//*[@data-localization-id=$current-id and @data-localization-mode='descriptive'][1], '|')"/>
                                        </xsl:variable>
                                        <xsl:value-of select="normalize-space($descriptive)"/>
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>
                        </xsl:choose>
                    </xsl:for-each>
                </xsl:element>
            </xsl:for-each>
        </root>
    </xsl:template>
    
    <xsl:template match="*[@data-localization-mode]">
        <xsl:element name="{@data-localization-mode}">
            <xsl:value-of select="normalize-space(.)"/>
        </xsl:element>
    </xsl:template>
    
</xsl:stylesheet>