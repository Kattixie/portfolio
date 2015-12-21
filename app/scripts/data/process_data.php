<?php

/**
 * These functions exists to help process data that is populated in class instances and other
 * objects, which is left over from an earlier project. The goal here is to convert underscore
 * naming to the camelCase naming convention for use in a JavaScript setting. These functions
 * are recursive and in the case of this project are run only sometimes, not per API request.
 *
 * Example usage:
 *
 *     require_once('helpers.php');
 *
 *     require_once('entries.php');
 *
 *     $entries = transform_all_object_properties( $entries );
 *
 *     header('Content-type: application/json');
 *
 *     echo json_encode( $entries );
 *
 */

// Original inspiration: http://stackoverflow.com/a/1444929/4848662

/**
 * Accepts an object, loops through its public properties, and changes the property names to
 * camelCase. It only processes the first-level properties of the original object passed to the
 * function. This exists as a test function. Note that it manipulates the object directly and
 * does not return a new value.
 *
 * @param stdClass|Entry|any $object
 * @param array $props
 */
function transform_object_properties_first_level(&$object, $props = NULL)
{
    if ( ! is_array($props) )
    {
        // Public properties
        $props = array_keys( get_object_vars($object) );
    }

    if ( count($props) == 0 )
    {
        // We've reached our base case.
    }
    else
    {
        if ( is_object($object) )
        {
            // Remove the first element in the array. This will result in an array element
            // decrement.
            $prop = array_shift($props);

            // Borrowed from: http://stackoverflow.com/a/13955545/
            $transformed_prop = preg_replace('/(_)(.)/e', "strtoupper('\\2')", $prop);

            $value = &$object->{$prop};

            $object->{$transformed_prop} = $value;

            transform_object_properties_first_level($object, $props);

            // Remove the property as it is currently named.
            unset($object->{$prop});

            // Unset the reference.
            unset($value);
        }
    }
}

/**
 * Accepts an object, loops through its public properties, and changes the property names to
 * camelCase. All levels of the object are processed. Note that it manipulates the object
 * passed to the function and returns it upon completion.
 *
 * @param stdClass|Entry|array|any $object
 * @param array $props
 * @return stdClass|Entry|array|any
 */
function transform_public_object_properties($object, $props = NULL)
{
    if ( is_array($object) )
    {
        if ( ! is_array($props) )
        {
            $props = array_keys( $object );
        }
    }
    else if ( is_object($object) )
    {
        if ( ! is_array($props) )
        {
            // Public properties
            $props = array_keys( get_object_vars($object) );
        }
    }
    else
    {
        // We've reached a base case. The object is primitive and cannot be further explored.

        return $object;
    }

    if ( count($props) == 0 )
    {
        // We've reached a base case. There are no more properties to explore for this complex
        // object.
    }
    else
    {
        // Take the first element in the properties array. This will result in an array element
        // decrement.
        $prop = array_shift($props);

        $transformed_prop = preg_replace('/(_)(.)/e', "strtoupper('\\2')", $prop);

        if ( is_array($object) )
        {
            $prop_reference = &$object[$transformed_prop];

            $value = &$object[$prop];
        }
        else
        {
            $prop_reference = &$object->{$transformed_prop};

            $value = &$object->{$prop};
        }

        // We need to dig further into $value if it's an object or array. The result should be
        // captured here.
        $prop_reference = transform_public_object_properties($value);

        // Continue to the next property attached to this object.
        transform_public_object_properties($object, $props);

        // Unset the reference. These do not impact the object, only our references.
        unset($prop_reference);
        unset($value);

        // Remove the property as it is currently named, but only if the property name was
        // indeed changed to something else. We want loose comparison here due to how property
        // names are unset and accessed.
        if ( $prop != $transformed_prop )
        {
            if ( is_array($object) )
            {
                unset( $object[$prop] );
            }
            else
            {
                unset( $object->{$prop} );
            }
        }
    }

    return $object;
}

/**
 * Accepts an object, loops through its public AND protected properties, and changes the
 * property names to camelCase. All levels of the object are processed. Note that all instances
 * that are not stdClass will be converted to stdClass, as it's assumed this function is
 * used for JSON output. This manipulation happens on the object passed to the function. It
 * is returned upon completion.
 *
 * @param stdClass|Entry|array|any $object
 * @param array $props
 * @return stdClass|array
 */
function transform_all_object_properties($object, $props = NULL)
{
    if ( is_array($object) )
    {
        if ( ! is_array($props) )
        {
            $props = array_keys( $object );
        }
    }
    else if ( is_object($object) )
    {
        if ( ! $object instanceof stdClass )
        {
            $object = copy_to_std_class($object);
        }

        if ( ! is_array($props) )
        {
            $props = get_all_properties($object);
        }
    }
    else
    {
        // We've reached a base case. The object is primitive and cannot be further explored.

        return $object;
    }

    if ( count($props) == 0 )
    {
        // We've reached a base case. There are no more properties to explore for this complex
        // object.
    }
    else
    {
        // Take the first element in the properties array. This will result in an array element
        // decrement.
        $prop = array_shift($props);

        // Transforms any letter before an underscore to uppercase, and removes the underscore.
        $transformed_prop = preg_replace('/(_)(.)/e', "strtoupper('\\2')", $prop);

        if ( is_array($object) )
        {
            $prop_reference = &$object[$transformed_prop];

            $value = &$object[$prop];
        }
        else if ( $object instanceof stdClass )
        {
            $prop_reference = &$object->{$transformed_prop};

            $value = &$object->{$prop};
        }
        else
        {
            // This type of object is not an array or instance of stdClass. It appears to be a
            // unique class and may have private and protected properties.
        }

        // Need to dig further into $value if it's an object or array of objects.
        // The result should be captured here.
        $prop_reference = transform_all_object_properties($value);

        // Continue to the next property attached to this object.
        $object = transform_all_object_properties($object, $props);

        // Unset the reference. These do not impact the object, only our references.
        unset($prop_reference);
        unset($value);

        // Remove the property as it is currently named, but only if the property name was
        // indeed changed to something else. We want loose comparison here due to how property
        // names are unset and accessed.
        if ( $prop != $transformed_prop )
        {
            if ( is_array($object) )
            {
                unset( $object[$prop] );
            }
            elseif ( $object instanceof stdClass )
            {
                unset( $object->{$prop} );
            }
            else
            {
                // We may be trying to unset private or protected properties.
            }
        }
    }

    return $object;
}

/**
 * Accepts an object of any class type and converts it to an instance of stdClass. If a
 * protected property exists, the value will be added if it can be accessed via a __get()
 * call. Such a property must be accounted for via an __isset() method as well. Note that this
 * function does not account for any dynamically added values. It will only copy values that
 * are explicitly defined in the class.
 *
 * @param Entry|Image|any $object
 * @return stdClass
 */
function copy_to_std_class($object)
{
    if ( ! is_object($object) )
    {
        throw new InvalidArgumentException('The first parameter of copy_to_std_class must be an object.');
    }

    // Throwing an exception because we want to know why this object made it to this function
    // through our existing flow.
    if ( $object instanceof stdClass )
    {
        throw new Exception('The object is already an instance of stdClass.');
    }

    $new_object = new stdClass();

    $reflect = new ReflectionClass($object);

    $all_props = $reflect->getProperties( ReflectionProperty::IS_PUBLIC | ReflectionProperty::IS_PROTECTED );

    foreach ($all_props as $prop)
    {
        $name = $prop->getName();

        // Assume protected properties begin with an underscore. When invoking them, we want to
        // check for a magic __get() function without the underscore.
        if ( $prop->isPrivate() || $prop->isProtected() )
        {
            if ( substr($name, 0, 1) === '_' )
            {
                $name = substr($name, 1);
            }
        }

        if (isset($object->{$name}))
        {
            $new_object->{$name} = $object->{$name};
        }
    }

    return $new_object;
}

/**
 * Accepts an object of any class type, discovers its public and protected properties, and
 * copies the property names to a new array.
 *
 * @param stdClass $object
 * @return array $props
 */
function get_all_properties($object)
{
    if ( ! is_object($object) )
    {
        throw new InvalidArgumentException('The first parameter of get_all_properties must be an object.');
    }

    $props = array();

    // stdClass appears to be incapable of inspection via ReflectionClass, possibly because
    // it has no private or protected properties. It could also be that ReflectionClass does
    // not detect dynamically added properties, including those of stdClass.
    if ( $object instanceof stdClass )
    {
        // Public properties
        $props = array_keys( get_object_vars($object) );
    }
    else
    {
        $reflect = new ReflectionClass($object);

        $all_props = $reflect->getProperties( ReflectionProperty::IS_PUBLIC | ReflectionProperty::IS_PROTECTED );

        foreach ($all_props as $prop)
        {
            $name = $prop->getName();

            // Assume protected properties begin with an underscore.
            if ( $prop->isPrivate() || $prop->isProtected() )
            {
                if ( substr($name, 0, 1) === '_' )
                {
                    $name = substr($name, 1);
                }
            }

            $props[] = $name;
        }
    }

    return $props;
}
