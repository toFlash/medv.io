---
layout: default
title: test
---


<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    

    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    

    
    

<!--- lang: php -->
    
    /**
     * @property int $id
     * @property string $text
     */
    class Foo
    {
        protected $id;
        protected $text;
     
        public function __get($name)
        {
            $methodName = 'get' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}() : $this->{$name};
        }
     
        public function __set($name, $value)
        {
            $methodName = 'set' . ucfirst($name);
            return method_exists($this, $methodName) ? $this->{$methodName}($value) : $this->{$name} = $value;
        }
     
        public function __isset($name)
        {
            return property_exists($this, $name);
        }
     
        public function setText($text)
        {
            $this->text = $text . ' World!';
        }
    }
    
    
    
    


