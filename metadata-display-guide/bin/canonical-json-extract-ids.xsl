<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:param name="guidelines"/>
    <xsl:param name="onix"/>
    <xsl:param name="epub"/>
    
    <xsl:variable name="groups">
        <groups>
            <group>ways-of-reading</group>
            <group>conformance</group>
            <group>navigation</group>
            <group>rich-content</group>
            <group>hazards</group>
            <group>accessibility-summary</group>
            <group>legal-considerations</group>
            <group>additional-accessibility-information</group>
        </groups>
    </xsl:variable>
    
    <xsl:template match="/">
        <ids>
            <xsl:for-each select="document('')/*/xsl:variable[@name='groups']/groups/group">
                <xsl:variable name="group" select="."/>
                <group name="{$group}">
                    <!-- Collect unique IDs -->
                    <xsl:for-each select="document($guidelines)//*[@data-localization-id and starts-with(@data-localization-id, concat($group,'-'))]/@data-localization-id |
                                        document($onix)//code[@id and starts-with(@id, concat($group,'-'))]/@id |
                                        document($epub)//code[@id and starts-with(@id, concat($group,'-'))]/@id">
                        <xsl:sort select="."/>
                        <xsl:if test="not(preceding::*[.=current()])">
                            <id><xsl:value-of select="."/></id>
                        </xsl:if>
                    </xsl:for-each>
                </group>
            </xsl:for-each>
        </ids>
    </xsl:template>
</xsl:stylesheet>