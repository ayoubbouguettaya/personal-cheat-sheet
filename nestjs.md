## validators 
using class-validator
### custom validator use 1

**Problem**

we have two attribute that can't co-existe whatever it's on params , query or body of the request . 

**Solution**

Nestjs has on optionated way to validate the data , which is the DTO layer using class-validator class-transformer library which comes with banch of useful validator such as IsString IsNotEmpty , ext .in the same this style of declaring validator is extensible , class-validator provide also a way to create custom validators , which we will use here to solve our problem  
```{ts}
@ValidatorConstraint({ name: 'ExclusiveQuery', async: false })
class ExclusiveQuery implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    const theOtherProperty = validationArguments.constraints[0];

    if (value && validationArguments.object[theOtherProperty]) {
      return false;
    }

    if (!value && !validationArguments.object[theOtherProperty]) {
      return false;
    }

    return true;
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `one at most of these parameters should be declared  [ ${validationArguments.constraints[0]} ,${validationArguments.property}]`
  }

}

export class OurQuery {

  @ApiProperty()
  @IsString()
  @IsOptional()
  query1?: string[]


  @ApiProperty()
  @IsString()
  @Validate(ExclusiveQuery, ["query1"])
  @ValidateIf((object, value) => (value !== undefined || object.query1 === undefined))
  query2?: string[]
}
```
