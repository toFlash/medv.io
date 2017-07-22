module Jekyll

  class OgImageGenerator < Generator
    def generate(site)
      dir = 'og'

      ensure_dir(File.join(site.dest, dir))

      site.posts.docs.each do |doc|
        filename = "#{doc.data['slug']}.png"
        title = doc.data['title']
        site.static_files << Image.new(site, site.dest, dir, filename, title)
      end
    end

    private

    def ensure_dir(path)
      FileUtils.mkdir_p(path)
    end
  end

  class Image < StaticFile
    def initialize(site, base, dir, name, content)
      @site = site
      @base = base
      @dir = dir
      @name = name
      @chrome = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
      @og = "#{@site.source}/assets/og.html"
      @content = content
    end

    def write(dest)
      filepath = destination(dest)
      return if File.file? filepath

      puts "Generating #{@name}"
      puts %x(#{@chrome} --headless \
                     --disable-gpu \
                     --screenshot \
                     --window-size=1200,630 \
                     --hide-scrollbars 'file://#{@og}##{@content}')
      puts %x(mv screenshot.png #{filepath})
    end

    def split(content)
      max = 35
      if content.length > max + 5
        match = /(.{1,#{max}}\s)(.*)/.match(content)
        if match
          line1 = match[1]
          line2 = match[2]
        else
          line1 = content[0...max]
          line2 = content[max..-1]
        end

        [line1, line2[0...max] + (line2.length > max ? '...' : '')].join('\n')
      else
        content
      end
    end

    def only_emoji(content)
      content.gsub(/(\w)/, ' ')
    end

  end

end
